import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

// 确保模拟在导入之前
jest.mock('./components/ProteinViewer', () => {
  return function MockProteinViewer(props: any) {
    return (
      <div data-testid="protein-viewer-mock">
        {props.pdbId && <div>PDB ID: {props.pdbId}</div>}
        {props.pdbData && <div data-testid="pdb-data-loaded">PDB Data Loaded</div>}
      </div>
    );
  };
});

// 模拟axios以避免导入问题
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'MOCK PDB DATA' })
}));

describe('App Component', () => {
  test('renders the app header', () => {
    render(<App />);
    // 使用更具体的选择器，指定在header中查找
    const headerElement = screen.getByRole('heading', { name: /蛋白分子查看器/i });
    expect(headerElement).toBeInTheDocument();
  });

  test('allows entering a PDB ID and submitting the form', async () => {
    render(<App />);
    
    // 查找输入框并输入新的PDB ID
    const input = screen.getByLabelText(/输入PDB ID/i);
    fireEvent.change(input, { target: { value: '4HHB' } });
    
    // 提交表单
    const submitButton = screen.getByRole('button', { name: /查看/i });
    fireEvent.click(submitButton);
    
    // 验证PDB ID已更新
    await waitFor(() => {
      const viewerElement = screen.getByTestId('protein-viewer-mock');
      expect(viewerElement).toHaveTextContent('PDB ID: 4HHB');
    });
  });

  test('allows uploading a PDB file', async () => {
    render(<App />);
    
    // 创建一个模拟的文件
    const file = new File(['mock pdb content'], 'test.pdb', { type: 'text/plain' });
    
    // 查找文件输入并上传文件
    const fileInput = screen.getByLabelText(/上传PDB文件/i);
    userEvent.upload(fileInput, file);
    
    // 验证文件名显示
    await waitFor(() => {
      expect(screen.getByText(/test.pdb/i)).toBeInTheDocument();
    });
    
    // 验证数据加载 - 使用data-testid查找元素
    await waitFor(() => {
      const dataLoadedElement = screen.getByTestId('pdb-data-loaded');
      expect(dataLoadedElement).toBeInTheDocument();
    });
  });

  test('allows clearing uploaded file', async () => {
    render(<App />);
    
    // 上传文件
    const file = new File(['mock pdb content'], 'test.pdb', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/上传PDB文件/i);
    userEvent.upload(fileInput, file);
    
    // 等待文件上传完成
    await waitFor(() => {
      expect(screen.getByText(/test.pdb/i)).toBeInTheDocument();
    });
    
    // 清除上传的文件
    const clearButton = screen.getByRole('button', { name: /清除/i });
    fireEvent.click(clearButton);
    
    // 验证文件已清除
    await waitFor(() => {
      expect(screen.queryByText(/test.pdb/i)).not.toBeInTheDocument();
    });
    
    // 验证恢复到默认PDB ID
    const viewerElement = screen.getByTestId('protein-viewer-mock');
    expect(viewerElement).toHaveTextContent('PDB ID: 1CRN');
  });
});
