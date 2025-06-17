export const codeExamples = {
	GET: {
		javascript: `// JavaScript/Node.js Example

// GET request
const response = await fetch('https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
    'x-auth-token': 'your-api-key',

  }
});

const data = await response.json();
console.log(data);`,

		python: `# Python Example

# GET request
import requests

url = "https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1"
headers = {
    "Content-Type": "application/json"
    "x-auth-token": "your-api-key",

}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`,
	},

	POST: {
		javascript: `// JavaScript/Node.js Example

// POST request
const postResponse = await fetch('https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    'x-auth-token': 'your-api-key',

  },
  body: JSON.stringify({
    data: {
        encrypted: false,
        data: { name: "vase", price: 100 } 
    }
    })
});

const postData = await postResponse.json();
console.log(postData);`,

		python: `# Python Example

# POST request
url = "https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1"
headers = {
    "Content-Type": "application/json"
    "x-auth-token": "your-api-key",
}

data = {
    data: {
        encrypted: false,
        data: { name: "vase", price: 100 } 
    }
}

response = requests.post(url, headers=headers, json=data)
post_data = response.json()
print(post_data)`,
	},

	PUT: {
		javascript: `// JavaScript/Node.js Example

// PUT request
const putResponse = await fetch('https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1&id=685114bc1bb339407bae65d5', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
    'x-auth-token': 'your-api-key',
  },
  body: JSON.stringify({
    data: {
        encrypted: false,
        data: { name: "vase", price: 100 } 
    }
    })
});

const putData = await putResponse.json();
console.log(putData);`,

		python: `# Python Example

# PUT request
url = "https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1&id=685114bc1bb339407bae65d5"
headers = {
    "Content-Type": "application/json"
    "x-auth-token": "your-api-key",
}

data = {
    data: {
        encrypted: false,
        data: { name: "vase", price: 100 } 
    }
}

response = requests.put(url, headers=headers, json=data)
put_data = response.json()
print(put_data)`,
	},

	DELETE: {
		javascript: `// JavaScript/Node.js Example

// DELETE request
const deleteResponse = await fetch('https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1&id=685114bc1bb339407bae65d5', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
    'x-auth-token': 'your-api-key',
  }
});

const deleteData = await deleteResponse.json();
console.log(deleteData);`,

		python: `# Python Example

# DELETE request
url = "https://dbconnect-server.onrender.com/api/app/products?db=dbconnect1&id=685114bc1bb339407bae65d5"
headers = {
    "Content-Type": "application/json"
    "x-auth-token": "your-api-key",
}

response = requests.delete(url, headers=headers)
delete_data = response.json()
print(delete_data)`,
	},
}
