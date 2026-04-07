#!/bin/bash

# CIMS Sample Data Population Script

# Get auth token
TOKEN=$(curl -X POST -s http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | \
  python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "Logged in successfully. Token: ${TOKEN:0:20}..."

# Create Teachers
echo ""
echo "Creating teachers..."
TEACHER1=$(curl -X POST -s http://localhost:8000/api/teachers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Smith\",
    \"subject\": \"Mathematics\",
    \"contact_number\": \"9876543210\",
    \"salary\": 50000,
    \"date_of_joining\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created teacher: John Smith (ID: $TEACHER1)"

TEACHER2=$(curl -X POST -s http://localhost:8000/api/teachers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Sarah Johnson\",
    \"subject\": \"Science\",
    \"contact_number\": \"9876543211\",
    \"salary\": 45000,
    \"date_of_joining\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created teacher: Sarah Johnson (ID: $TEACHER2)"

TEACHER3=$(curl -X POST -s http://localhost:8000/api/teachers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Mike Brown\",
    \"subject\": \"English\",
    \"contact_number\": \"9876543212\",
    \"salary\": 48000,
    \"date_of_joining\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created teacher: Mike Brown (ID: $TEACHER3)"

# Create Batches
echo ""
echo "Creating batches..."
BATCH1=$(curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 10 - Mathematics\",
    \"description\": \"Advanced mathematics for grade 10\",
    \"teacher_id\": $TEACHER1,
    \"schedule\": \"Mon, Wed, Fri - 10:00 AM\",
    \"start_date\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created batch: Grade 10 - Mathematics (ID: $BATCH1)"

BATCH2=$(curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 9 - Science\",
    \"description\": \"General science course\",
    \"teacher_id\": $TEACHER2,
    \"schedule\": \"Tue, Thu - 2:00 PM\",
    \"start_date\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created batch: Grade 9 - Science (ID: $BATCH2)"

BATCH3=$(curl -X POST -s http://localhost:8000/api/batches/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Grade 8 - English\",
    \"description\": \"English literature and grammar\",
    \"teacher_id\": $TEACHER3,
    \"schedule\": \"Mon, Wed - 3:00 PM\",
    \"start_date\": $(date +%s)000
  }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Created batch: Grade 8 - English (ID: $BATCH3)"

# Create Students
echo ""
echo "Creating students..."

for i in {1..15}; do
  # Distribute students across batches
  if [ $i -le 5 ]; then
    BATCH=$BATCH1
    BATCH_NAME="Grade 10 - Math"
  elif [ $i -le 10 ]; then
    BATCH=$BATCH2
    BATCH_NAME="Grade 9 - Science"
  else
    BATCH=$BATCH3
    BATCH_NAME="Grade 8 - English"
  fi

  MONTHLY_FEE=$((3000 + RANDOM % 2000))

  STUDENT=$(curl -X POST -s http://localhost:8000/api/students/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Student $i\",
      \"roll_number\": \"STU$(printf '%03d' $i)\",
      \"batch_id\": $BATCH,
      \"contact_number\": \"98765432$(printf '%02d' $i)\",
      \"parent_name\": \"Parent $i\",
      \"parent_contact\": \"98765431$(printf '%02d' $i)\",
      \"monthly_fee\": $MONTHLY_FEE,
      \"date_of_joining\": $(date +%s)000
    }" | python -c "import sys, json; print(json.load(sys.stdin)['id'])")

  echo "Created student: Student $i in $BATCH_NAME (ID: $STUDENT)"
done

# Create Fee Records
echo ""
echo "Creating fee records..."

for i in {1..20}; do
  STUDENT_ID=$((1 + RANDOM % 15))
  AMOUNT=$((3000 + RANDOM % 2000))

  curl -X POST -s http://localhost:8000/api/fee-records/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"student_id\": $STUDENT_ID,
      \"amount\": $AMOUNT,
      \"payment_date\": $(date +%s)000,
      \"payment_method\": \"Cash\",
      \"remarks\": \"Monthly fee payment\"
    }" > /dev/null

  echo "Created fee record for student ID: $STUDENT_ID - Amount: ₹$AMOUNT"
done

# Create Expenses
echo ""
echo "Creating expenses..."

EXPENSES=(
  '{"title":"Electricity Bill","description":"Monthly electricity charges","amount":5000,"category":"Utilities","expense_date":'$(date +%s)000',"payment_method":"Bank Transfer"}'
  '{"title":"Stationery Purchase","description":"Books and supplies","amount":3500,"category":"Office Supplies","expense_date":'$(date +%s)000',"payment_method":"Cash"}'
  '{"title":"Staff Salaries","description":"Monthly salary payment","amount":150000,"category":"Salaries","expense_date":'$(date +%s)000',"payment_method":"Bank Transfer"}'
  '{"title":"Internet Bill","description":"Broadband charges","amount":2000,"category":"Utilities","expense_date":'$(date +%s)000',"payment_method":"Online"}'
  '{"title":"Furniture Purchase","description":"New desks and chairs","amount":25000,"category":"Infrastructure","expense_date":'$(date +%s)000',"payment_method":"Card"}'
  '{"title":"Cleaning Services","description":"Monthly cleaning contract","amount":4000,"category":"Maintenance","expense_date":'$(date +%s)000',"payment_method":"Cash"}'
  '{"title":"Marketing Materials","description":"Brochures and banners","amount":8000,"category":"Marketing","expense_date":'$(date +%s)000',"payment_method":"Online"}'
)

for expense in "${EXPENSES[@]}"; do
  TITLE=$(echo $expense | python -c "import sys, json; print(json.load(sys.stdin)['title'])")
  curl -X POST -s http://localhost:8000/api/expenses/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$expense" > /dev/null

  echo "Created expense: $TITLE"
done

# Create Attendance Records
echo ""
echo "Creating attendance records..."

TODAY=$(date +%s)000
for day in {0..6}; do
  DATE=$((TODAY - day * 86400000))

  for student_id in {1..15}; do
    # 90% attendance rate
    if [ $((RANDOM % 10)) -lt 9 ]; then
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
      }" > /dev/null
  done
done

echo "Created attendance records for last 7 days"

echo ""
echo "=========================================="
echo "Sample data population completed!"
echo "=========================================="
echo "Summary:"
echo "- Teachers: 3"
echo "- Batches: 3"
echo "- Students: 15"
echo "- Fee Records: 20"
echo "- Expenses: 7"
echo "- Attendance: Last 7 days for all students"
echo "=========================================="
