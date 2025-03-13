#!/bin/bash

# 清除终端
clear

echo "====================================="
echo "蛋白分子查看器测试运行器"
echo "====================================="

# 安装依赖（如果需要）
if [ "$1" == "--install" ]; then
  echo "正在安装依赖..."
  npm install
  echo "依赖安装完成！"
  echo
fi

# 运行所有测试
if [ "$1" == "--coverage" ]; then
  echo "正在运行测试并生成覆盖率报告..."
  npm run test:coverage
else
  echo "正在运行所有测试..."
  npm run test:all
fi

# 测试完成
echo
echo "测试运行完成！"
echo "=====================================" 