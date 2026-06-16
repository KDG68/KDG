# SoftZone — Simple Local Web Server (No dependencies required)
# Runs using built-in Windows .NET HttpListener

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=================================================="
    Write-Host "  SoftZone Local Server is running!"
    Write-Host "  Open your browser and go to:"
    Write-Host "  http://localhost:$port/"
    Write-Host "=================================================="
    Write-Host "Press Ctrl+C in this terminal to stop the server."
    Write-Host ""
} catch {
    Write-Host "Error: Could not start server. Port $port might be in use."
    Write-Host $_.Exception.Message
    exit
}

$currentDir = $PSScriptRoot
if (!$currentDir) { $currentDir = Get-Location }

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        # URL decode
        $urlPath = [System.Web.HttpUtility]::UrlDecode($urlPath)
        if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }
        
        # Prevent path traversal
        $normalizedPath = $urlPath.Replace("/", "\")
        if ($normalizedPath.StartsWith("\")) {
            $normalizedPath = $normalizedPath.Substring(1)
        }
        $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($currentDir, $normalizedPath))
        
        # Ensure file is inside current directory
        if (!$filePath.StartsWith($currentDir)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content-type detection
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css" { $contentType = "text/css; charset=utf-8" }
                ".js" { $contentType = "application/javascript; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                ".png" { $contentType = "image/png" }
                ".jpg" { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg" { $contentType = "image/svg+xml" }
                ".ico" { $contentType = "image/x-icon" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
    } catch {
        # Silent fail for client disconnects
    } finally {
        if ($response) {
            try { $response.Close() } catch {}
        }
    }
}
