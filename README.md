# 控制反转和依赖注入

1. 通过 `yarn add create-app <app-name> --template=typescript` 创建 react 项目

2. 运行 `yarn run eject` 来展开所有 `react` 的配置

3. 添加 `babel-plugin-transform-typescript-metadata` 和 `@babel/plugin-proposal-decorators` 依赖
    ```typescript
    yarn add babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators
    ```

4. 在 `package.json` 中设置 `babel` 配置项
    ```typescript
    "babel": {
        "presets": [
          "react-app"
        ],
        "plugins": [
          "babel-plugin-transform-typescript-metadata",
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
            }
          ]
        ]
      }
    ```

5. 在 `tsconfig.json` 中将 `emitDecoratorMetadata` 和 `experimentalDecorators` 设置为 `true`, `target` 设置为 `es5`
```typescript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "es5",
  },
}
```
> 这样就能在react中使用装饰器和元数据了, 具体使用见 [App.tsx](./src/App.tsx) line 30