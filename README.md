# Voxelo.ai editor - 3D Gaussian Splat Editor

<sub>Forked from Supersplat</sub>

[Voxelo.ai editor](https://voxelo.ai/editor) | [App](https://voxelo.ai/)

Voxelo.ai is is a tool for inspecting, editing, optimizing and publishing 3D Gaussian Splats. It is built on web technologies and runs in the browser, so there's nothing to download or install.

A live version of this tool is available at: https://editor.voxelo.ai

## Local Development

To initialize a local development environment for Voxelo.ai editor, ensure you have [Node.js](https://nodejs.org/) 18 or later installed. Follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/voxeloai/editor.git
   cd editor
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build Voxelo.ai editor and start a local web server:

   ```sh
   npm run develop
   ```

4. Open a web browser tab and make sure network caching is disabled on the network tab and the other application caches are clear:

   - On Safari you can use `Cmd+Option+e` or Develop->Empty Caches.
   - On Chrome ensure the options "Update on reload" and "Bypass for network" are enabled in the Application->Service workers tab:

   <img width="846" alt="Screenshot 2025-04-25 at 16 53 37" src="https://github.com/user-attachments/assets/888bac6c-25c1-4813-b5b6-4beecf437ac9" />

5. Navigate to `http://localhost:3000`

When changes to the source are detected, Voxelo.ai editor is rebuilt automatically. Simply refresh your browser to see your changes.
