using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;

namespace PackingLauncher {
    static class Program {
        [STAThread]
        static void Main() {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string serverUrl = "http://127.0.0.1:3000";

            bool isRunning = CheckServerOnline(serverUrl + "/health");

            if (!isRunning) {
                string nodePath = FindNodeExecutable();
                string serverScript = Path.Combine(baseDir, "server.ts");
                string tsxCli = Path.Combine(baseDir, "node_modules", "tsx", "dist", "cli.mjs");

                if (!File.Exists(serverScript)) {
                    MessageBox.Show("Could not find backend server script at:\n" + serverScript, "Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                if (!File.Exists(tsxCli)) {
                    MessageBox.Show("Dependencies are not installed.\nRun \"npm install\" in:\n" + baseDir, "Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                ProcessStartInfo psi = new ProcessStartInfo {
                    FileName = nodePath,
                    Arguments = "\"" + tsxCli + "\" \"" + serverScript + "\"",
                    WorkingDirectory = baseDir,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };

                try {
                    Process.Start(psi);
                } catch (Exception ex) {
                    MessageBox.Show("Failed to launch Node.js backend: " + ex.Message, "Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                for (int i = 0; i < 15; i++) {
                    Thread.Sleep(300);
                    if (CheckServerOnline(serverUrl + "/health")) {
                        isRunning = true;
                        break;
                    }
                }
            }

            string chromiumPath = FindChromiumBrowser();
            string firefoxPath = FindFirefoxBrowser();
            bool launched = false;
            long ticks = DateTime.UtcNow.Ticks;

            if (!string.IsNullOrEmpty(chromiumPath) && File.Exists(chromiumPath)) {
                string profileDir = Path.Combine(baseDir, "data", "app-profile");
                ProcessStartInfo chromiumPsi = new ProcessStartInfo {
                    FileName = chromiumPath,
                    Arguments = "--app=" + serverUrl + "/?t=" + ticks + " --window-size=1480,920 --disable-cache --user-data-dir=\"" + profileDir + "\"",
                    UseShellExecute = false
                };
                try {
                    Process.Start(chromiumPsi);
                    launched = true;
                } catch {}
            }

            if (!launched && !string.IsNullOrEmpty(firefoxPath) && File.Exists(firefoxPath)) {
                ProcessStartInfo firefoxPsi = new ProcessStartInfo {
                    FileName = firefoxPath,
                    Arguments = "-new-window \"" + serverUrl + "/?t=" + ticks + "\"",
                    UseShellExecute = false
                };
                try {
                    Process.Start(firefoxPsi);
                    launched = true;
                } catch {}
            }

            if (!launched) {
                Process.Start(serverUrl);
            }
        }

        static bool CheckServerOnline(string url) {
            try {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Timeout = 1200;
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse()) {
                    return resp.StatusCode == HttpStatusCode.OK;
                }
            } catch {
                return false;
            }
        }

        static string FindNodeExecutable() {
            string pathEnv = Environment.GetEnvironmentVariable("PATH");
            if (pathEnv != null) {
                foreach (string p in pathEnv.Split(';')) {
                    string full = Path.Combine(p.Trim(), "node.exe");
                    if (File.Exists(full)) return full;
                }
            }
            string[] standard = new string[] {
                @"C:\Program Files\nodejs\node.exe",
                @"C:\Program Files (x86)\nodejs\node.exe"
            };
            foreach (string s in standard) {
                if (File.Exists(s)) return s;
            }
            return "node.exe";
        }

        static string FindChromiumBrowser() {
            string[] candidates = new string[] {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe"),
                @"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
            };
            foreach (string c in candidates) {
                if (File.Exists(c)) return c;
            }
            return null;
        }

        static string FindFirefoxBrowser() {
            string[] candidates = new string[] {
                @"C:\Program Files\Mozilla Firefox\firefox.exe",
                @"C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
            };
            foreach (string c in candidates) {
                if (File.Exists(c)) return c;
            }
            return null;
        }
    }
}
