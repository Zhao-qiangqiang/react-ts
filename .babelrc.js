module.exports = {
    presets: ['@souche-f2e/babel-preset-muji'],
    plugins: [
      [
        'import',
        {
          libraryName: 'ant-design-pro',
          libraryDirectory: 'lib',
          style: true,
          camel2DashComponentName: false
        },
        'ant-design-pro'
      ],
      [
        'import',
        { libraryName: 'antd', libraryDirectory: 'lib', style: true },
        'ant'
      ],
      [
        'import',
        {
          libraryName: '@souche-ui/so-ui-react', 
          customName: name => {
            return `@souche-ui/so-ui-react/dist/npm/es5/src/components/${name}`;
          },
          style: name => {
            const newName = name.split('/').pop();
            return `@souche-ui/so-ui-react/dist/styles/${newName}.css`;
          }
        }
      ]
    ]
  };
  