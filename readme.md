# Express Backend for AI-Assisted Lesson Planning

This repository contains an Express.js backend service that leverages OpenAI to assist teachers with lesson planning and coordination. The service is designed to align with generic pedagogic and teaching best practices while allowing customization based on the teacher's own requirements.

## Features

- **AI-Powered Lesson Assistance:** The core functionality is centered around the OpenAI GPT-3 model, providing teachers with intelligent text responses based on lesson-related prompts.

- **File Upload for Context:** Teachers can upload text or PDF files via the `/api/files/upload` endpoint. These files contribute to the contextual understanding of the AI model, enhancing the specificity of responses.

- **Supabase Integration:** The backend integrates with Supabase, utilizing the environment variables `SUPABASE_URL` and `SUPABASE_API_KEY` for database interactions.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [pnpm](https://pnpm.io/) as the package manager (`npm install -g pnpm`)

### Configuration

1. Obtain OpenAI API key: Visit the [OpenAI website](https://beta.openai.com/signup/) to sign up and obtain your API key.

2. Create a `.env` file in the project root and add your OpenAI API key, Supabase URL, and Supabase API key:

   ```env
   OPENAI_API_KEY=your-api-key-here
   SUPABASE_URL=your-supabase-url
   SUPABASE_API_KEY=your-supabase-api-key
   ```

### Running the Server

Start the Express server:

```bash
pnpm start
```

The server will run at `http://localhost:3000`.

## API Endpoints

- **POST /api/ai/prompt:** Send a prompt to the OpenAI model and receive an AI-generated text response.

  Example:

  ```json
  {
    "prompt": "What are the key concepts to include in a science lesson about photosynthesis?"
  }
  ```

- **POST /api/files/upload:** Upload a text or PDF file to contribute to the context for AI responses.

  Example (using [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)):

  ```javascript
  const formData = new FormData();
  formData.append('file', file); // 'file' is the key for the uploaded file

  fetch('http://localhost:3000/api/files/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error uploading file:', error));
  ```

## Frontend Integration

The frontend for this project can be found in the [unterricht.ai](https://github.com/CivanErbay/unterricht.ai) repository. It is built using Nuxt.js and is configured to be served from the backend's `/public` folder.

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Your contributions are valuable in improving the AI assistance for teachers.

## License

This project is licensed under the [MIT License](LICENSE).
