@echo off
cd /d "%~dp0"
echo.
echo Keep this window open while testing the website.
echo Open this address in your browser: http://localhost:8765/
echo.
set "CODEX_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%CODEX_PYTHON%" goto use_codex
py -3 -c "import sys" >nul 2>nul
if not errorlevel 1 goto use_py
python -c "import sys" >nul 2>nul
if not errorlevel 1 goto use_python
echo Python 3 was not found. Read START_HERE.txt for another way to open the site.
pause
exit /b 1

:use_codex
"%CODEX_PYTHON%" -m http.server 8765 --bind 127.0.0.1
goto done

:use_py
py -3 -m http.server 8765 --bind 127.0.0.1
goto done

:use_python
python -m http.server 8765 --bind 127.0.0.1

:done
echo Server stopped. If port 8765 was busy, close the other server and run this file again.
pause
