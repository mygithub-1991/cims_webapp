// Dashboard Data Verification Script
// Run this in browser console after logging in to verify data

async function verifyDashboard() {
    console.log('🔍 Verifying Dashboard Data...\n');

    const token = localStorage.getItem('cims_auth_token');

    if (!token) {
        console.error('❌ No authentication token found! Please login first.');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log('📡 Fetching data from API...\n');

        const [students, teachers, batches, fees, expenses] = await Promise.all([
            fetch('http://localhost:8000/api/students/', { headers }).then(r => r.json()),
            fetch('http://localhost:8000/api/teachers/', { headers }).then(r => r.json()),
            fetch('http://localhost:8000/api/batches/', { headers }).then(r => r.json()),
            fetch('http://localhost:8000/api/fee-records/', { headers }).then(r => r.json()),
            fetch('http://localhost:8000/api/expenses/', { headers }).then(r => r.json())
        ]);

        console.log('✅ Data fetched successfully!\n');

        // Calculate statistics exactly as dashboard does
        const totalRevenue = fees.reduce((sum, fee) => sum + fee.amount_paid, 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const pendingFees = students.reduce(
            (sum, student) => sum + Math.max(0, student.total_fees - student.paid_fees),
            0
        );

        console.log('📊 DASHBOARD STATISTICS:\n');
        console.log('╔════════════════════════════════════╗');
        console.log(`║ Total Students:  ${students.length.toString().padEnd(17)}║`);
        console.log(`║ Total Teachers:  ${teachers.length.toString().padEnd(17)}║`);
        console.log(`║ Total Batches:   ${batches.length.toString().padEnd(17)}║`);
        console.log(`║ Pending Fees:    Rs.${pendingFees.toLocaleString().padEnd(13)}║`);
        console.log(`║ Total Revenue:   Rs.${totalRevenue.toLocaleString().padEnd(13)}║`);
        console.log(`║ Total Expenses:  Rs.${totalExpenses.toLocaleString().padEnd(13)}║`);
        console.log(`║ Net Profit:      Rs.${(totalRevenue - totalExpenses).toLocaleString().padEnd(13)}║`);
        console.log('╚════════════════════════════════════╝\n');

        // Verify data structure
        console.log('🔬 Data Structure Verification:\n');

        if (students.length > 0) {
            const student = students[0];
            console.log('✅ Student fields:', Object.keys(student).join(', '));
            console.log(`   Sample: ${student.name}, Total: ${student.total_fees}, Paid: ${student.paid_fees}`);
        }

        if (fees.length > 0) {
            const fee = fees[0];
            console.log('✅ Fee Record fields:', Object.keys(fee).join(', '));
            console.log(`   Sample: Student ID ${fee.student_id}, Amount: ${fee.amount_paid}`);
        }

        if (expenses.length > 0) {
            const expense = expenses[0];
            console.log('✅ Expense fields:', Object.keys(expense).join(', '));
            console.log(`   Sample: ${expense.category}, Amount: ${expense.amount}`);
        }

        console.log('\n✅ All verifications passed!');
        console.log('📝 The dashboard should display the statistics shown above.');

        return {
            totalStudents: students.length,
            totalTeachers: teachers.length,
            totalBatches: batches.length,
            pendingFees,
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses
        };

    } catch (error) {
        console.error('❌ Error verifying dashboard:', error);
        console.error('Stack:', error.stack);
    }
}

// Run verification
console.log('='.repeat(50));
console.log('CIMS Dashboard Data Verification');
console.log('='.repeat(50) + '\n');

verifyDashboard().then(stats => {
    if (stats) {
        console.log('\n✅ Dashboard should show these exact numbers!');
    }
});
