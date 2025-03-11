import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface ProteinViewerProps {
  pdbId?: string;
  pdbData?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
}

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
        
        // 设置样式
        viewerRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
        
        // 添加表面
        viewerRef.current.addSurface(1, {  // 使用数字1代替SurfaceType.VDW
          opacity: 0.7,
          color: 'white'
        });
        
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

  return (
    <div className="protein-viewer-container">
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">错误: {error}</div>}
      <div 
        ref={viewerDivRef} 
        className="protein-viewer" 
        style={{ width, height, position: 'relative' }}
      />
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
    </div>
  );
};

export default ProteinViewer; 