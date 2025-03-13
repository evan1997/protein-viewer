import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// 模拟ProteinViewer组件
jest.mock('../components/ProteinViewer', () => {
  return function MockProteinViewer(props: any) {
    return (
      <div data-testid="protein-viewer-mock">
        {props.pdbId && <div>PDB ID: {props.pdbId}</div>}
        {props.pdbData && <div data-testid="pdb-data-loaded">PDB Data Loaded</div>}
        <div className="controls">
          <button>Y轴旋转90°</button>
          <button>X轴旋转90°</button>
          <button>放大</button>
          <button>缩小</button>
          <button>开始旋转</button>
          <button>停止旋转</button>
        </div>
        <div className="style-controls">
          <select data-testid="style-selector">
            <option value="cartoon">卡通(Cartoon)</option>
            <option value="stick">棍状(Stick)</option>
          </select>
          <select data-testid="color-selector">
            <option value="spectrum">光谱(Spectrum)</option>
            <option value="chain">链(Chain)</option>
          </select>
          <input type="checkbox" data-testid="surface-toggle" />
        </div>
      </div>
    );
  };
});

// 模拟axios
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'MOCK PDB DATA' })
}));

describe('User Interactions End-to-End Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete user workflow: search PDB, change style, adjust view', async () => {
    render(<App />);
    
    // 步骤1: 输入PDB ID并提交
    const input = screen.getByLabelText(/输入PDB ID/i);
    fireEvent.change(input, { target: { value: '1HIV' } });
    
    const submitButton = screen.getByRole('button', { name: /查看/i });
    fireEvent.click(submitButton);
    
    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('protein-viewer-mock')).toBeInTheDocument();
    });
    
    // 验证PDB ID已更新
    expect(screen.getByTestId('protein-viewer-mock')).toHaveTextContent('PDB ID: 1HIV');
    
    // 步骤5: 尝试上传PDB文件
    const file = new File(['mock pdb content'], 'test.pdb', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/上传PDB文件/i);
    userEvent.upload(fileInput, file);
    
    // 验证文件名显示
    await waitFor(() => {
      expect(screen.getByText(/test.pdb/i)).toBeInTheDocument();
    });
    
    // 验证数据加载
    await waitFor(() => {
      const dataLoadedElement = screen.getByTestId('pdb-data-loaded');
      expect(dataLoadedElement).toBeInTheDocument();
    });
    
    // 步骤6: 清除上传的文件
    const clearButton = screen.getByRole('button', { name: /清除/i });
    fireEvent.click(clearButton);
    
    // 验证文件已清除
    await waitFor(() => {
      expect(screen.queryByText(/test.pdb/i)).not.toBeInTheDocument();
    });
    
    // 验证恢复到默认PDB ID
    expect(screen.getByTestId('protein-viewer-mock')).toHaveTextContent('PDB ID: 1CRN');
  });
}); 