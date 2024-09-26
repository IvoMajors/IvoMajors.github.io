// Store API key locally
function saveApiKey() {
    const apiKey = document.getElementById('api-key').value;
    if (apiKey) {
        localStorage.setItem('chatgpt_api_key', apiKey);
        alert("API Key saved!");
    } else {
        alert("Please enter a valid API key.");
    }
}

// Clear the stored API key
function clearApiKey() {
    localStorage.removeItem('chatgpt_api_key');
    alert("API Key cleared!");
}

// Handle form submission
document.getElementById('audienceForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const country = document.getElementById('country').value;
    const description = document.getElementById('description').value;
    const apiKey = localStorage.getItem('chatgpt_api_key');

    if (!apiKey) {
        document.getElementById('error-message').innerText = "Please enter and save your API key first.";
        return;
    }

    const requestBody = {
        model: "gpt-4o",  // Use your appropriate ChatGPT model
        messages: [
            { role: "system", content: "You are a marketing expert generating audience profiles." },
            { role: "user", content: `Create a profile for an audience in ${country} with the following description: ${description}` }
        ]
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`API request failed: ${errorResponse.error.message}`);
        }
    
        const data = await response.json();
        const generatedText = data.choices[0].message.content;
    
        // Display the result
        displayResults(generatedText);
    } catch (error) {
        document.getElementById('error-message').innerText = "Error: " + error.message;
    }
    
});

function displayResults(generatedText) {
    // Example of parsing the result, adjust as needed based on response structure
    const audienceName = "Generated Audience Name";  // Extract this from `generatedText`
    const audienceDescription = "Generated Audience Description";  // Extract from `generatedText`
    const imageUrl = "https://via.placeholder.com/400";  // Placeholder or extract from `generatedText`

    document.getElementById('audienceName').innerText = audienceName;
    document.getElementById('audienceDescription').innerText = audienceDescription;
    document.getElementById('audienceImage').src = imageUrl;
    document.getElementById('audienceImage').style.display = "block";
}
