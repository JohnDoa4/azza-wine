# Локальный сервер без кеша для разработки: python tools/serve.py [порт] [--lan]
# --lan открывает доступ с телефона из той же Wi-Fi сети (адрес http://<IP компьютера>:порт/).
import http.server, os, sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a): pass
args = [a for a in sys.argv[1:] if not a.startswith('--')]
port = int(args[0]) if args else 8792
host = '0.0.0.0' if '--lan' in sys.argv else '127.0.0.1'
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
http.server.ThreadingHTTPServer((host, port), H).serve_forever()
