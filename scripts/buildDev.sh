set \"INLINE_RUNTIME_CHUNK=false\"

cd ./frontend
npm run build

cd ../ts
npm run build

cd ../

rm -rf ytdwl-build
mkdir ytdwl-build

cp -r public/* ytdwl-build/

mv ts/out/ ytdwl-build/src
mv frontend/build ytdwl-build/html
