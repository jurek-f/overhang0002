@echo off
cd /d "%~dp0..\.."
npm create vite@latest app -- --template react-ts
cd app
npm install
