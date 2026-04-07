#!/bin/bash

# CIMS Sample Data Population Script (Corrected)

# Get auth token
echo "Getting authentication token..."
TOKEN=$(curl -X POST -s http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | \
  python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "Logged in successfully!"

# Get existing teacher IDs
TEACHER_IDS=$(curl -s http://localhost:8000/api/teachers/ -H "Authorization: Bearer $TOKEN" | \
  python -c "import sys, json; data = json.load(sys.stdin); print(' '.join(str(t['id']) for t in data[:3]))")

TEACHER_ARRAY=($TEACHER_IDS)
TEACHER1=${TEACHER_ARRAY[0]}
TEACHER2=${TEACHER_ARRAY[1]}
TEACHER3=${TEACHER_ARRAY[2]}

echo "Using teachers: $TEACHER1, $TEACHER2, $TEACHER3"

# Create Batches
echo ""
echo "Creating batches..."

curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 10 Mathematics\",
    \"time\": \"Monday & Wednesday 10:00 AM - 12:00 PM\",
    \"teacher_id\": $TEACHER1
  }" > /dev/null
echo "Created batch: Grade 10 Mathematics"

curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 9 Science\",
    \"time\": \"Tuesday & Thursday 2:00 PM - 4:00 PM\",
    \"teacher_id\": $TEACHER2
  }" > /dev/null
echo "Created batch: Grade 9 Science"

curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 8 English\",
    \"time\": \"Monday & Wednesday 3:00 PM - 5:00 PM\",
    \"teacher_id\": $TEACHER3
  }" > /dev/null
echo "Created batch: Grade 8 English"

# Get batch IDs
BATCH_IDS=$(curl -s http://localhost:8000/api/batches/ -H "Authorization: Bearer $TOKEN" | \
  python -c "import sys, json; data = json.load(sys.stdin); print(' '.join(str(b['id']) for b in data[-3:]))")

BATCH_ARRAY=($BATCH_IDS)
BATCH1=${BATCH_ARRAY[0]}
BATCH2=${BATCH_ARRAY[1]}
BATCH3=${BATCH_ARRAY[2]}

echo "Created batches with IDs: $BATCH1, $BATCH2, $BATCH3"

# Create Students
echo ""
echo "Creating students..."

STUDENT_NAMES=(
  "Rahul Sharma" "Priya Patel" "Amit Kumar" "Sneha Singh" "Rohan Gupta"
  "Ananya Mehta" "Vikram Reddy" "Kavya Iyer" "Arjun Joshi" "Neha Desai"
  "Siddharth Verma" "Pooja Nair" "Karan Malhotra" "Riya Chatterjee" "Aditya Rao"
)

for i in {0..14}; do
  # Distribute students across batches
  if [ $i -lt 5 ]; then
    BATCH=$BATCH1
    BATCH_NAME="Grade 10 Math"
  elif [ $i -lt 10 ]; then
    BATCH=$BATCH2
    BATCH_NAME="Grade 9 Science"
  else
    BATCH=$BATCH3
    BATCH_NAME="Grade 8 English"
  fi

  TOTAL_FEES=$((30000 + RANDOM % 20000))
  PAID_FEES=$((TOTAL_FEES * (50 + RANDOM % 50) / 100))

  curl -X POST -s http://localhost:8000/api/students/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"roll_number\": \"STU$(printf '%03d' $((i + 1)))\",
      \"name\": \"${STUDENT_NAMES[$i]}\",
      \"contact_number\": \"98765$(printf '%05d' $((43210 + i)))\",
      \"total_fees\": $TOTAL_FEES,
      \"paid_fees\": $PAID_FEES,
      \"batch_id\": $BATCH,
      \"payment_mode\": \"Monthly\"
    }" > /dev/null

  echo "Created student: ${STUDENT_NAMES[$i]} in $BATCH_NAME (Total: ₹$TOTAL_FEES, Paid: ₹$PAID_FEES)"
done

# Create Fee Records
echo ""
echo "Creating fee payment records..."

for i in {1..25}; do
  STUDENT_ID=$((1 + RANDOM % 15))
  AMOUNT=$((3000 + RANDOM % 5000))

  DAYS_AGO=$((RANDOM % 60))
  PAYMENT_DATE=$((($(date +%s) - DAYS_AGO * 86400) * 1000))

  curl -X POST -s http://localhost:8000/api/fee-records/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"student_id\": $STUDENT_ID,
      \"amount\": $AMOUNT,
      \"payment_date\": $PAYMENT_DATE,
      \"payment_method\": \"Cash\",
      \"remarks\": \"Monthly fee payment\"
    }" > /dev/null

  echo "Created fee payment: Student ID $STUDENT_ID - ₹$AMOUNT"
done

# Create Expenses
echo ""
echo "Creating expense records..."

EXPENSE_DATA=(
  "Electricity Bill|Monthly electricity charges|5000|Utilities|Cash"
  "Stationery Purchase|Books, pens, and supplies|3500|Office Supplies|Cash"
  "Teacher Salaries|Monthly salary payment|150000|Salaries|Bank Transfer"
  "Internet & Phone|Broadband and phone charges|2500|Utilities|Online"
  "Furniture Purchase|New desks and chairs|25000|Infrastructure|Card"
  "Cleaning Services|Monthly cleaning contract|4000|Maintenance|Cash"
  "Marketing Materials|Brochures and banners|8000|Marketing|Online"
  "Water Bill|Monthly water charges|1500|Utilities|Cash"
  "Building Rent|Monthly office rent|45000|Rent|Bank Transfer"
  "Lab Equipment|Science lab equipment|18000|Infrastructure|Card"
)

for expense_line in "${EXPENSE_DATA[@]}"; do
  IFS='|' read -r TITLE DESC AMOUNT CATEGORY METHOD <<< "$expense_line"

  DAYS_AGO=$((RANDOM % 30))
  EXPENSE_DATE=$((($(date +%s) - DAYS_AGO * 86400) * 1000))

  curl -X POST -s http://localhost:8000/api/expenses/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"$TITLE\",
      \"description\": \"$DESC\",
      \"amount\": $AMOUNT,
      \"category\": \"$CATEGORY\",
      \"expense_date\": $EXPENSE_DATE,
      \"payment_method\": \"$METHOD\"
    }" > /dev/null

  echo "Created expense: $TITLE - ₹$AMOUNT"
done

# Create Attendance Records
echo ""
echo "Creating attendance records..."

TODAY=$(date +%s)
ATTENDANCE_COUNT=0

for day in {0..13}; do
  DATE=$(((TODAY - day * 86400) * 1000))

  for student_id in {1..15}; do
    # 85% attendance rate
    if [ $((RANDOM % 100)) -lt 85 ]; then
      STATUS="present"
    else
      STATUS="absent"
    fi

    curl -X POST -s http://localhost:8000/api/attendance/ \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"student_id\": $student_id,
        \"date\": $DATE,
        \"status\": \"$STATUS\"
      }" > /dev/null 2>&1

    ATTENDANCE_COUNT=$((ATTENDANCE_COUNT + 1))
  done
done

echo "Created $ATTENDANCE_COUNT attendance records for last 14 days"

echo ""
echo "=========================================="
echo "✅ Sample data population completed!"
echo "=========================================="
echo "Summary:"
echo "- Teachers: 3 (existing)"
echo "- Batches: 3 (new)"
echo "- Students: 15 (new)"
echo "- Fee Records: 25 (new)"
echo "- Expenses: 10 (new)"
echo "- Attendance: $ATTENDANCE_COUNT records (14 days)"
echo "=========================================="
echo ""
echo "Now refresh your dashboard to see the data!"
