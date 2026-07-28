<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '../DemoBlock.vue';

interface TreeNode {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    key: '0-0',
    title: '华东大区',
    children: [
      {
        key: '0-0-0',
        title: '上海分公司',
        children: [
          { key: '0-0-0-0', title: '研发部' },
          { key: '0-0-0-1', title: '市场部' },
        ],
      },
      {
        key: '0-0-1',
        title: '杭州分公司（停用）',
        disabled: true,
        children: [{ key: '0-0-1-0', title: '销售部' }],
      },
    ],
  },
  {
    key: '0-1',
    title: '华南大区',
    children: [
      { key: '0-1-0', title: '深圳分公司' },
      { key: '0-1-1', title: '广州分公司' },
    ],
  },
];

const expanded = ['0-0', '0-0-0', '0-1'];

// 拖拽用独立可变副本
const dragData = ref<TreeNode[]>(JSON.parse(JSON.stringify(treeData)));

function walk(arr: TreeNode[], key: string, cb: (item: TreeNode, idx: number, list: TreeNode[]) => void) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].key === key) {
      cb(arr[i], i, arr);
      return true;
    }
    if (arr[i].children && walk(arr[i].children as TreeNode[], key, cb)) return true;
  }
  return false;
}

function onDrop({ dragNode, dropNode, dropPosition }: { dragNode: any; dropNode: any; dropPosition: number }) {
  const data = dragData.value;
  let moving: TreeNode | undefined;
  walk(data, dragNode.key, (item, idx, list) => {
    moving = item;
    list.splice(idx, 1);
  });
  if (!moving) return;
  if (dropPosition === 0) {
    walk(data, dropNode.key, (item) => {
      item.children = item.children || [];
      item.children.push(moving as TreeNode);
    });
  } else {
    walk(data, dropNode.key, (_item, idx, list) => {
      list.splice(dropPosition < 0 ? idx : idx + 1, 0, moving as TreeNode);
    });
  }
  dragData.value = [...data];
}
</script>

<template>
  <div>
    <DemoBlock title="基础用法" desc="每个节点需全局唯一 key；title 为显示内容。节点可设 disabled 禁用。">
      <a-tree :data="treeData" :default-expanded-keys="expanded" :default-selected-keys="['0-0-0-0']" />
    </DemoBlock>

    <DemoBlock title="可勾选" desc="checkable 显示复选框，父子联动。">
      <a-tree :data="treeData" checkable :default-expanded-keys="expanded" :default-checked-keys="['0-0-0-0', '0-1-0']" />
    </DemoBlock>

    <DemoBlock title="连接线" desc="show-line 显示层级连接线，深层级更清晰。">
      <a-tree :data="treeData" show-line :default-expanded-keys="expanded" />
    </DemoBlock>

    <DemoBlock title="多选" desc="multiple 支持多选节点（Ctrl / 框选）。">
      <a-tree :data="treeData" multiple :default-expanded-keys="expanded" :default-selected-keys="['0-0-0-0', '0-1-0']" />
    </DemoBlock>

    <DemoBlock title="可拖拽" desc="draggable 拖拽调整层级 / 顺序（此示例已接入 onDrop 重排）。">
      <a-tree :data="dragData" draggable :default-expanded-keys="expanded" @drop="onDrop" />
    </DemoBlock>
  </div>
</template>
