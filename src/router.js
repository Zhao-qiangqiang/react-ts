const Loadable = require('react-loadable');

const dynamic = (component) => {
  // 在开发环境下如果使用 `import()` 语法，webpack 的 HMR 可能会有点问题
  // 可以使用 `babel-plugin-dynamic-import-node-sync` 这个 babel 插件将 `import()` 语法转化为同步 `require` 语法
  // 此时 component 就不再是一个返回 Promise 的函数了
  if (component.toString().indexOf('.then(') < 0) {
    return component().default;
  }
  return Loadable({
    loader: () => component().then((raw) => raw.default || raw),
    loading: () => null,
  });
};
export default {
  routes: [
    {
      path: '/',
      name: '存货',
      children: [
        {
          path: 'vehicleInventoryOpreate/',
          name: '整车成本调整',
          children: [
            {
              path: '',
              redirect: 'list'
            },
            {
              path: 'list',
              component: dynamic(() =>
                import('@/pages/vehicleInventoryOpreate/index.tsx')
              ),
            },
            {
              path: 'opreate',
              component: dynamic(() =>
                import('@/pages/vehicleInventoryOpreate/component/index.tsx')
              ),
            },
          ],
        },
        {
          path: 'commodityInventoryCost/',
          name: '商品成本调整',
          children: [
            {
              path: '',
              redirect: 'list'
            },
            {
              path: 'list',
              component: dynamic(() =>
                import('@/pages/commodityInventoryCost/index.tsx')
              ),
            },
            {
              path: 'opreate',
              component: dynamic(() =>
                import('@/pages/commodityInventoryCost/component/index.tsx')
              ),
            },
          ],
        },
        {
          path: 'vehicleCostInquiry/',
          name: '整车成本调整查询',
          children: [
            {
              path: '',
              redirect: 'list'
            },
            {
              path: 'list',
              component: dynamic(() =>
                import('@/pages/vehicleCostInquiry/index.tsx')
              ),
            },
          ]
        },
        {
          path: 'commodityCostInquiry/',
          name: '商品成本调整查询',
          children: [
            {
              path: '',
              redirect: 'list'
            },
            {
              path: 'list',
              component: dynamic(() =>
                import('@/pages/commodityCostInquiry/index.tsx')
              ),
            },
          ]
        }
      ],
      component: dynamic(() => import('@/pages/_layout/index.tsx')),
    },
  ],
};
