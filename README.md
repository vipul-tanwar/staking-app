This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/vipul-tanwar/staking-app.git
   ```
2. Rename .env.local.example to .env.local add NEXT_PUBLIC_RPC (Infura RPC)
   ```sh
   NEXT_PUBLIC_RPC=
   ```
3. First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

##Repository Structure 
```bash
my-nextjs-app/
├── abi/                 # Next.js pages directory
│   └── ...
├── app/                 # Pages and Global CSS
│   └── ...
├── components/          # React components
│   └── ...
├── data/                # Json Data (Contract Details)
│   └── ...
├── types/               # Typescript Interaces
│   └── ...
├── utils/               # Utility functions
│   └── ...
├── .gitignore           # Git ignore file
├── next.config.js       # Next.js configuration
├── package.json         # Node.js dependencies and scripts
├── tailwind.config.ts   # Typescipt Con
└── README.md            # Project readme
```
<!-- │   ├── index.js         # Home page -->

Package Version
1. Nextjs : 14.1.2
2. Ethers : 5.7
