const fs = require('fs');

async function run() {
  const envText = fs.readFileSync('.env', 'utf8');
  let env = {};
  envText.split('\n').forEach(l => {
    const i = l.indexOf('=');
    if (i > 0) {
      env[l.substring(0, i).trim()] = l.substring(i + 1).trim().replace(/"/g, '');
    }
  });

  console.log('Fetching token...');
  const res = await fetch('https://open.plantbook.io/api/v1/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${env.OPENPLANTBOOK_CLIENT_ID}&client_secret=${env.OPENPLANTBOOK_CLIENT_SECRET}`
  });
  const data = await res.json();
  console.log('Token data:', data.access_token ? 'SUCCESS' : data);

  console.log('\nFetching search for tomato...');
  const res1 = await fetch('https://open.plantbook.io/api/v1/plant/search?alias=tomato', {
    headers: { 'Authorization': 'Bearer ' + data.access_token }
  });
  const search = await res1.json();
  console.log(JSON.stringify(search, null, 2));

  console.log('\nFetching details for monstera deliciosa...');
  const res2 = await fetch('https://open.plantbook.io/api/v1/plant/detail/monstera%20deliciosa/', {
    headers: { 'Authorization': 'Bearer ' + data.access_token }
  });
  const plant = await res2.json();
  console.log(JSON.stringify(plant, null, 2));
}

run();
