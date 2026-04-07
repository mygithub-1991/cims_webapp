#!/bin/bash

# Add Fee Records with correct schema

TOKEN=$(curl -X POST -s http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | \
  python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "Creating fee payment records..."

for i in {1..30}; do
  STUDENT_ID=$((1 + RANDOM % 15))
  AMOUNT=$((3000 + RANDOM % 5000))
  DAYS_AGO=$((RANDOM % 60))
  DATE=$((($(date +%s) - DAYS_AGO * 86400) * 1000))
  RECEIPT_ID="RCP$(date +%Y%m%d)$(printf '%04d' $i)"

  curl -X POST -s http://localhost:8000/api/fee-records/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"student_id\": $STUDENT_ID,
      \"amount_paid\": $AMOUNT,
      \"payment_method\": \"Cash\",
      \"date\": $DATE,
      \"receipt_id\": \"$RECEIPT_ID\",
      \"remarks\": \"Monthly fee payment\"
    }" > /dev/null

  echo "Created fee payment: Student ID $STUDENT_ID - Rs.$AMOUNT (Receipt: $RECEIPT_ID)"
done

echo ""
echo "✅ Created 30 fee payment records!"
