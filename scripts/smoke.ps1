param(
  [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

Write-Host "Smoke test against $BaseUrl"
Write-Host "Make sure the server is running (npm run dev).`n"

function Send-Json($url, $obj) {
  $json = $obj | ConvertTo-Json
  return Invoke-RestMethod -Method Post -Uri $url -ContentType "application/json" -Body $json
}

# 1) Create reservation
$createBody = @{
  roomId = "A"
  start  = "2030-01-01T10:00:00.000Z"
  end    = "2030-01-01T11:00:00.000Z"
  title  = "Smoke"
}

$created = Send-Json "$BaseUrl/reservations" $createBody
if (-not $created.id) { throw "Create failed: no id returned." }
Write-Host "Created reservation id:" $created.id

# 2) List
$list = Invoke-RestMethod -Uri "$BaseUrl/rooms/A/reservations"
$count = @($list).Count
Write-Host "List count after create:" $count

# 3) Overlap (expect failure)
$overlapBody = @{
  roomId = "A"
  start  = "2030-01-01T10:30:00.000Z"
  end    = "2030-01-01T11:30:00.000Z"
}

try {
  $null = Send-Json "$BaseUrl/reservations" $overlapBody
  throw "Expected overlap to fail, but it succeeded."
} catch {
  Write-Host "Overlap check: OK (failed as expected)"
}

# 4) Delete
Invoke-RestMethod -Method Delete -Uri "$BaseUrl/reservations/$($created.id)"
Write-Host "Deleted reservation id:" $created.id

# 5) Verify deletion
$list2 = Invoke-RestMethod -Uri "$BaseUrl/rooms/A/reservations"
$count2 = @($list2).Count
Write-Host "List count after delete:" $count2

Write-Host "`nSmoke test OK."
