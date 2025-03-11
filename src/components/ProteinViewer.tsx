import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

interface ProteinViewerProps {
  pdbId?: string;
  pdbData?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
}

// 定义显示样式类型
type StyleType = 'cartoon' | 'stick' | 'sphere' | 'line' | 'cross';
// 定义颜色方案类型
type ColorScheme = 'spectrum' | 'chain' | 'residue' | 'secondary structure' | 'element';

const ProteinViewer: React.FC<ProteinViewerProps> = ({
  pdbId,
  pdbData,
  width = '100%',
  height = '500px',
  backgroundColor = '#f0f0f0'
}) => {
  const viewerDivRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<$3Dmol.Viewer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<StyleType>('cartoon');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('spectrum');
  const [showSurface, setShowSurface] = useState<boolean>(true);
  const [surfaceOpacity, setSurfaceOpacity] = useState<number>(0.7);
  const [proteinInfo, setProteinInfo] = useState<{atoms: number, residues: number} | null>(null);

  useEffect(() => {
    if (!viewerDivRef.current) return;

    // 初始化3Dmol查看器
    viewerRef.current = $3Dmol.createViewer(viewerDivRef.current, {
      backgroundColor: backgroundColor,
      width: width,
      height: height,
      antialias: true,
    });

    return () => {
      // 清理
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [backgroundColor, height, width]);

  // 应用样式和颜色方案
  const applyStyleAndColor = () => {
    if (!viewerRef.current) return;
    
    // 清除之前的样式
    viewerRef.current.removeAllSurfaces();
    
    // 应用新样式
    const styleObj: any = {};
    
    switch (currentStyle) {
      case 'cartoon':
        styleObj.cartoon = { color: colorScheme };
        break;
      case 'stick':
        styleObj.stick = { radius: 0.2, color: colorScheme };
        break;
      case 'sphere':
        styleObj.sphere = { radius: 1.0, color: colorScheme };
        break;
      case 'line':
        styleObj.line = { linewidth: 1.5, color: colorScheme };
        break;
      case 'cross':
        styleObj.cross = { linewidth: 1.0, colorscheme: colorScheme };
        break;
      default:
        styleObj.cartoon = { color: colorScheme };
    }
    
    viewerRef.current.setStyle({}, styleObj);
    
    // 添加表面
    if (showSurface) {
      viewerRef.current.addSurface(1, {
        opacity: surfaceOpacity,
        color: 'white'
      });
    }
    
    viewerRef.current.render();
  };

  useEffect(() => {
    const loadProtein = async () => {
      if (!viewerRef.current) return;
      
      try {
        setLoading(true);
        setError(null);
        
        let proteinData = pdbData;
        
        // 如果没有直接提供PDB数据，但提供了PDB ID，则从RCSB PDB获取数据
        if (!proteinData && pdbId) {
          const response = await axios.get(`https://files.rcsb.org/download/${pdbId}.pdb`);
          proteinData = response.data;
        }
        
        if (!proteinData) {
          throw new Error('未提供PDB数据或ID');
        }
        
        // 清除之前的模型
        viewerRef.current.removeAllModels();
        
        // 添加新模型
        const model = viewerRef.current.addModel(proteinData, 'pdb');
        
        // 计算蛋白质信息 - 使用类型断言
        const modelAny = model as any;
        if (modelAny) {
          try {
            if (modelAny.atoms && Array.isArray(modelAny.atoms)) {
              // 使用模型的原子数量作为统计
              const atoms = modelAny.atoms.length;
              
              // 计算唯一残基数量
              const residueSet = new Set();
              modelAny.atoms.forEach((atom: any) => {
                if (atom && atom.resi !== undefined) {
                  residueSet.add(atom.resi);
                }
              });
              
              const residues = residueSet.size;
              setProteinInfo({ atoms, residues });
            }
          } catch (err) {
            console.error('计算蛋白质信息时出错:', err);
            // 出错时不设置蛋白质信息，UI将不显示相关内容
          }
        }
        
        // 应用样式和颜色
        applyStyleAndColor();
        
        // 居中并渲染
        viewerRef.current.zoomTo();
        viewerRef.current.render();
        
        setLoading(false);
      } catch (err) {
        console.error('加载蛋白质数据时出错:', err);
        setError(err instanceof Error ? err.message : '加载蛋白质数据时出错');
        setLoading(false);
      }
    };

    if (pdbId || pdbData) {
      loadProtein();
    }
  }, [pdbId, pdbData]);

  // 当样式或颜色方案改变时重新应用
  useEffect(() => {
    if (viewerRef.current && (pdbId || pdbData)) {
      applyStyleAndColor();
    }
  }, [currentStyle, colorScheme, showSurface, surfaceOpacity]);

  return (
    <div className="protein-viewer-container">
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">错误: {error}</div>}
      <div 
        ref={viewerDivRef} 
        className="protein-viewer" 
        style={{ width, height, position: 'relative' }}
      />
      
      <div className="viewer-info">
        {proteinInfo && (
          <div className="protein-stats">
            <span>原子数: {proteinInfo.atoms}</span>
            <span>残基数: {proteinInfo.residues}</span>
          </div>
        )}
      </div>
      
      <div className="controls-container">
        <div className="controls">
          <button onClick={() => viewerRef.current?.rotate(90, 'y')}>
            Y轴旋转90°
          </button>
          <button onClick={() => viewerRef.current?.rotate(90, 'x')}>
            X轴旋转90°
          </button>
          <button onClick={() => viewerRef.current?.zoom(0.8)}>
            放大
          </button>
          <button onClick={() => viewerRef.current?.zoom(1.2)}>
            缩小
          </button>
          <button onClick={() => {
            if (viewerRef.current) {
              viewerRef.current.spin('y');
            }
          }}>
            开始旋转
          </button>
          <button onClick={() => {
            if (viewerRef.current) {
              viewerRef.current.spin('');  // 使用空字符串代替false
            }
          }}>
            停止旋转
          </button>
        </div>
        
        <div className="style-controls">
          <div className="control-group">
            <label>显示样式:</label>
            <select 
              value={currentStyle} 
              onChange={(e) => setCurrentStyle(e.target.value as StyleType)}
            >
              <option value="cartoon">卡通(Cartoon)</option>
              <option value="stick">棍状(Stick)</option>
              <option value="sphere">球状(Sphere)</option>
              <option value="line">线框(Line)</option>
              <option value="cross">交叉(Cross)</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>颜色方案:</label>
            <select 
              value={colorScheme} 
              onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
            >
              <option value="spectrum">光谱(Spectrum)</option>
              <option value="chain">链(Chain)</option>
              <option value="residue">残基(Residue)</option>
              <option value="secondary structure">二级结构(Secondary)</option>
              <option value="element">元素(Element)</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={showSurface} 
                onChange={(e) => setShowSurface(e.target.checked)} 
              />
              显示表面
            </label>
            
            {showSurface && (
              <div className="slider-container">
                <label>表面透明度:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={surfaceOpacity} 
                  onChange={(e) => setSurfaceOpacity(parseFloat(e.target.value))} 
                />
                <span>{surfaceOpacity}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinViewer;