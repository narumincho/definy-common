[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/narumincho/definy-core)

# definy-core

Definy common logic and type definition

Definy のサーバーとブラウザの

- 共通の処理
- TypeScript の型定義, バイナリエンコーダ, バイナリデコーダ

が書かれている.

## コード生成のスクリプト

npm script の `generateCode` は `schema` フォルダ内に書かれている Definy の 型定義から, コードを生成する.

生成されたコードは [`source/data.ts`](https://github.com/narumincho/definy-core/blob/main/source/data.ts) に出力され, definy-core 自身で使われている
