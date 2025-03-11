import React, { useState } from 'react';
import './App.css';
import ProteinViewer from './components/ProteinViewer';

function App() {
  const [pdbId, setPdbId] = useState<string>('1CRN');
  const [inputPdbId, setInputPdbId] = useState<string>('1CRN');
  const [pdbData, setPdbData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPdbId(inputPdbId);
    setPdbData(null); // 清除之前上传的PDB数据
    setFileName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPdbData(content);
      setPdbId(''); // 清除PDB ID，因为我们现在使用上传的数据
    };
    reader.readAsText(file);
  };

  const clearUploadedFile = () => {
    setPdbData(null);
    setFileName(null);
    setInputPdbId('1CRN');
    setPdbId('1CRN');
  };

  const examplePdbIds = ['1CRN', '4HHB', '1BNA', '1AKE', '3PQR', '1HIV', '2LYZ', '1A3N', '1OLG', '3EIY'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>蛋白分子查看器</h1>
      </header>
      <main>
        <div className="search-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="pdbId">输入PDB ID：</label>
            <input
              type="text"
              id="pdbId"
              value={inputPdbId}
              onChange={(e) => setInputPdbId(e.target.value)}
              placeholder="例如：1CRN"
              disabled={!!pdbData}
            />
            <button type="submit" disabled={!!pdbData}>查看</button>
          </form>
          
          <div className="file-upload-container">
            <label htmlFor="pdbFile" className="file-upload-label">
              上传PDB文件
              <input
                type="file"
                id="pdbFile"
                accept=".pdb"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            {fileName && (
              <div className="uploaded-file-info">
                <span>已上传: {fileName}</span>
                <button onClick={clearUploadedFile} className="clear-file-btn">清除</button>
              </div>
            )}
          </div>
          
          <div className="examples">
            <p>示例PDB ID：</p>
            <div className="example-buttons">
              {examplePdbIds.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setInputPdbId(id);
                    setPdbId(id);
                    setPdbData(null);
                    setFileName(null);
                  }}
                  disabled={!!pdbData}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="app-layout">
          <div className="fixed-section">
            <div className="viewer-container">
              {pdbData ? (
                <ProteinViewer pdbData={pdbData} />
              ) : (
                <ProteinViewer pdbId={pdbId} />
              )}
            </div>
          </div>
          
          <div className="scrollable-section">
            <div className="info-container">
              <h2>
                {pdbData 
                  ? `当前显示：${fileName}` 
                  : `当前显示：${pdbId}`
                }
              </h2>
              <p>
                PDB ID是蛋白质数据库（Protein Data Bank）中的唯一标识符。
                您可以在<a href="https://www.rcsb.org/" target="_blank" rel="noopener noreferrer">RCSB PDB</a>网站上搜索更多蛋白质结构。
              </p>
              <h3>示例说明：</h3>
              <ul>
                <li><strong>1CRN</strong> - 鸡冠花凝集素（Crambin）</li>
                <li><strong>4HHB</strong> - 人类血红蛋白</li>
                <li><strong>1BNA</strong> - B-DNA双螺旋结构</li>
                <li><strong>1AKE</strong> - 腺苷酸激酶</li>
                <li><strong>3PQR</strong> - 绿色荧光蛋白（GFP）</li>
              </ul>
              <h3>蛋白质结构基础知识</h3>
              <p>蛋白质是由氨基酸链组成的大分子，它们在生物体内执行各种功能。蛋白质结构通常分为四个层次：</p>
              <ul>
                <li><strong>一级结构</strong>：氨基酸序列</li>
                <li><strong>二级结构</strong>：局部折叠结构，如α-螺旋和β-折叠</li>
                <li><strong>三级结构</strong>：整个蛋白质链的三维结构</li>
                <li><strong>四级结构</strong>：多个蛋白质亚基的组合</li>
              </ul>
              <p>在这个查看器中，您可以观察到蛋白质的三维结构，包括其二级结构元素和整体折叠方式。</p>
              
              <h3>蛋白质功能与结构关系</h3>
              <p>蛋白质的功能与其三维结构密切相关。结构决定功能是蛋白质科学的基本原则之一。</p>
              <ul>
                <li><strong>酶</strong>：催化生化反应的蛋白质，其活性位点的精确结构对于底物识别和催化至关重要。</li>
                <li><strong>受体</strong>：细胞表面的蛋白质，能够识别并结合特定的配体，启动细胞内信号传导。</li>
                <li><strong>转运蛋白</strong>：负责将分子从细胞的一部分转运到另一部分，或跨膜转运。</li>
                <li><strong>结构蛋白</strong>：提供细胞和组织的结构支持，如胶原蛋白。</li>
              </ul>
              
              <h3>蛋白质结构测定方法</h3>
              <p>科学家使用多种技术来确定蛋白质的三维结构：</p>
              <ul>
                <li><strong>X射线晶体学</strong>：通过分析X射线在蛋白质晶体中的衍射模式来确定原子位置。</li>
                <li><strong>核磁共振(NMR)光谱</strong>：利用原子核在磁场中的行为来确定蛋白质在溶液中的结构。</li>
                <li><strong>冷冻电子显微镜(Cryo-EM)</strong>：通过分析冷冻样品中蛋白质的电子显微图像来确定结构。</li>
              </ul>
              
              <h3>蛋白质结构预测</h3>
              <p>随着计算方法的发展，科学家现在可以使用人工智能算法（如AlphaFold）来预测蛋白质的三维结构，这在没有实验结构数据的情况下特别有用。</p>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} 蛋白分子查看器</p>
      </footer>
    </div>
  );
}

export default App;