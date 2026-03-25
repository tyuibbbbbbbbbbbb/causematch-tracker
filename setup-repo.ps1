$token = (echo "protocol=https`nhost=github.com" | git credential fill) | Where-Object { $_ -match "^password=" } | ForEach-Object { $_ -replace "^password=", "" }

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = "causematch-tracker"
    description = "CauseMatch campaign tracker - real-time monitoring"
    private = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repo created: $($response.html_url)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host $_.ErrorDetails.Message
}
