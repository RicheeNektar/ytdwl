cd ./frontend
npm run build:dev

cd ../ts
npm run build

cd ../

rm -vrf ytdwl-build
mkdir -v ytdwl-build

cp -vr public/* ytdwl-build/

mv -v ts/out/ ytdwl-build/src
mv -v frontend/build ytdwl-build/html
