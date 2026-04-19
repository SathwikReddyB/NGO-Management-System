import http from 'http';

async function testBookingFlow() {
  const baseUrl = 'http://localhost:5001/api';

  const makeRequest = (url, method, body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    console.log('1. Registering NGO...');
    const ngoResp = await makeRequest(`${baseUrl}/auth/register/ngo`, 'POST', {
      name: 'Test NGO',
      email: `ngo${Date.now()}@example.com`,
      password: 'testpassword',
      category: 'Education',
      phone: '1234567890'
    });
    console.log('NGO registered:', ngoResp.status, ngoResp.body);
    const ngoId = ngoResp.body.id;

    console.log('\n2. Registering Candidate...');
    const canResp = await makeRequest(`${baseUrl}/auth/register/candidate`, 'POST', {
      name: 'Test Volunteer',
      email: `volunteer${Date.now()}@example.com`,
      password: 'testpassword',
      phone: '0987654321',
      skills: ['Teaching']
    });
    console.log('Candidate registered:', canResp.status, canResp.body);
    const candidateId = canResp.body.id;

    console.log('\n3. Creating Time Slot...');
    const slotResp = await makeRequest(`${baseUrl}/slots`, 'POST', {
      ngoId,
      date: '2026-12-01',
      startTime: '10:00',
      endTime: '12:00',
      capacity: 5,
      description: 'Morning Teaching'
    });
    console.log('Slot created:', slotResp.status, slotResp.body);
    const slotId = slotResp.body.id;

    console.log('\n4. Creating Booking...');
    const bookResp = await makeRequest(`${baseUrl}/bookings`, 'POST', {
      candidateId,
      slotId,
      ngoId
    });
    console.log('Booking created:', bookResp.status, bookResp.body);

    console.log('\n5. Verifying Bookings for NGO...');
    const ngoBksResp = await makeRequest(`${baseUrl}/bookings/ngo/${ngoId}`, 'GET');
    console.log('NGO Bookings:', ngoBksResp.status, ngoBksResp.body);

    console.log('\nAll tests completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBookingFlow();
