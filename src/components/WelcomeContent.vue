<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  addText: [];
}>();

const demoMessage = ref('');
const showDemo = ref(false);

function tryDemo() {
  showDemo.value = true;
  demoMessage.value = 'Text copied to demo clipboard! ✅';
  setTimeout(() => {
    demoMessage.value = '';
    showDemo.value = false;
  }, 2000);
}

function handleAddText() {
  emit('addText');
}
</script>

<template>
  <div class="welcome-container">
    <section class="hero">
      <h2>Welcome to QuickText!</h2>
      <p class="subtitle">Your privacy-first, offline text snippet manager</p>
    </section>

    <section class="getting-started">
      <h3>🚀 Getting Started</h3>
      <p>
        Click the <span class="fab-demo">+</span> button below to add your first
        text snippet. Perfect for:
      </p>
      <ul class="feature-list">
        <li>📧 Email signatures and templates</li>
        <li>📱 Social media posts and responses</li>
        <li>💼 Business contact information</li>
        <li>🔗 Frequently used links and addresses</li>
      </ul>
    </section>

    <section class="features">
      <h3>✨ Key Features</h3>

      <div class="feature-grid">
        <div class="feature-card">
          <h4>📃 Quick Copy & Share</h4>
          <p>
            One-click copying to clipboard or sharing via your device's native
            share menu.
          </p>
          <div class="demo-snippet">
            <div class="snippet-preview">
              <div class="snippet-text">
                Check out this amazing website: https://example.com
              </div>
              <div class="snippet-actions">
                <button class="demo-btn interactive" @click="tryDemo">
                  📃
                </button>
                <button class="demo-btn">💬</button>
                <button class="demo-btn">❌</button>
              </div>
            </div>
            <div v-if="showDemo" class="demo-feedback">
              {{ demoMessage }}
            </div>
          </div>
        </div>

        <div class="feature-card">
          <h4>🎯 Smart Templates</h4>
          <p>
            Use <code v-text="'{' + '{variable}' + '}'"></code> syntax for
            dynamic content that adapts to your needs.
          </p>
          <div class="demo-snippet">
            <div class="snippet-preview">
              <div class="snippet-text">
                Hi <span v-text="'{' + '{name}' + '}'"></span>, thanks for your
                <span v-text="'{' + '{type}' + '}'"></span> inquiry!
              </div>
              <div class="snippet-actions">
                <button class="demo-btn">📃</button>
                <button class="demo-btn">💬</button>
                <button class="demo-btn">❌</button>
              </div>
            </div>
            <div class="template-example">
              <small>↓ When used, you'll fill in the variables:</small>
              <div class="variable-form">
                <input type="text" placeholder="name" readonly />
                <input type="text" placeholder="type" readonly />
              </div>
            </div>
          </div>
        </div>

        <div class="feature-card">
          <h4>🔒 Complete Privacy</h4>
          <p>
            All your data stays on your device. No servers, no tracking, no data
            collection.
          </p>
          <div class="privacy-benefits">
            <div class="benefit">✓ Works offline</div>
            <div class="benefit">✓ No account needed</div>
            <div class="benefit">✓ Local storage only</div>
            <div class="benefit">✓ Under 100KB</div>
          </div>
        </div>

        <div class="feature-card">
          <h4>📱 Progressive Web App</h4>
          <p>
            Install QuickText for native-like experience across all your
            devices.
          </p>
          <div class="pwa-benefits">
            <div class="benefit">📲 Install from browser</div>
            <div class="benefit">⚡ Lightning fast</div>
            <div class="benefit">🌙 Auto dark mode</div>
            <div class="benefit">📴 Works offline</div>
          </div>
        </div>
      </div>
    </section>

    <section class="github-full-width">
      <div class="github-card">
        <h3>🚀 Open Source</h3>
        <p>
          QuickText is open source and actively maintained on GitHub. Visit our
          repository to:
        </p>
        <div class="github-benefits">
          <div class="benefit">🌟 View the source code and contribute</div>
          <div class="benefit">🐛 Report bugs or request features</div>
          <div class="benefit">🗺️ See what's coming next</div>
          <div class="benefit">⭐ Support the project with a star</div>
        </div>
        <a
          href="https://github.com/fuzzzerd/quicktext"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          🌐 Visit QuickText on GitHub
        </a>
      </div>
    </section>

    <section class="examples">
      <h3>💡 Template Examples</h3>
      <div class="example-grid">
        <div class="example-card">
          <h5>Meeting Invitation</h5>
          <div class="example-text">
            Hi <span v-text="'{' + '{name}' + '}'"></span>, let's meet
            <span v-text="'{' + '{date}' + '}'"></span> at
            <span v-text="'{' + '{time}' + '}'"></span> to discuss
            <span v-text="'{' + '{topic}' + '}'"></span>. Location:
            <span v-text="'{' + '{location}' + '}'"></span>
          </div>
          <div class="variables">
            Variables: name, date, time, topic, location
          </div>
        </div>

        <div class="example-card">
          <h5>Customer Support</h5>
          <div class="example-text">
            Hello <span v-text="'{' + '{customer}' + '}'"></span>, thank you for
            contacting us about <span v-text="'{' + '{issue}' + '}'"></span>.
            Your ticket #<span v-text="'{' + '{ticket}' + '}'"></span> has been
            created.
          </div>
          <div class="variables">Variables: customer, issue, ticket</div>
        </div>

        <div class="example-card">
          <h5>Social Media Post</h5>
          <div class="example-text">
            🎉 Excited to share
            <span v-text="'{' + '{achievement}' + '}'"></span> with
            <span v-text="'{' + '{platform}' + '}'"></span>!
            <span v-text="'{' + '{hashtags}' + '}'"></span> #success
          </div>
          <div class="variables">
            Variables: achievement, platform, hashtags
          </div>
        </div>
      </div>
    </section>


    <section class="call-to-action">
      <p class="cta-text">
        Ready to boost your productivity? Start by adding your first text
        snippet!
      </p>
      <button class="add-text-btn" @click="handleAddText">
        ➕ Add Your First Text Snippet
      </button>
    </section>
  </div>
</template>

<style scoped>
.welcome-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--accent);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-light);
  margin: 0;
}

section {
  margin-bottom: 2rem;
}

section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--accent);
}

section h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--accent);
}

section h5 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--accent);
}

.fab-demo {
  display: inline-block;
  background: var(--accent);
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  text-align: center;
  line-height: 1.5rem;
  font-weight: bold;
  margin: 0 0.2rem;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-card {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: var(--accent-background);
}

.demo-snippet {
  margin-top: 1rem;
}

.snippet-preview {
  border: 1px dashed var(--accent);
  border-radius: 0.25rem;
  padding: 0.75rem;
  background: var(--background);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.snippet-text {
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
  margin-right: 1rem;
}

.snippet-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.demo-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
  margin: 0;
  border: 1px solid var(--border);
  background: var(--background);
  border-radius: 0.25rem;
  cursor: default;
  font-size: 0.8rem;
}

.demo-btn.interactive {
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-btn.interactive:hover {
  background: var(--accent);
  color: white;
  transform: scale(1.05);
}

.demo-feedback {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--accent);
  color: white;
  border-radius: 0.25rem;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.template-example {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--background);
  border-radius: 0.25rem;
}

.template-example small {
  color: var(--text-light);
  display: block;
  margin-bottom: 0.5rem;
}

.variable-form {
  display: flex;
  gap: 0.5rem;
}

.variable-form input {
  font-size: 0.8rem;
  padding: 0.25rem;
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  background: var(--accent-background);
}

.privacy-benefits,
.pwa-benefits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
}

.benefit {
  font-size: 0.9rem;
  color: var(--text-light);
  padding: 0.25rem;
}

.example-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.example-card {
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  padding: 1rem;
  background: var(--accent-background);
}

.example-text {
  font-family: monospace;
  background: var(--background);
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
  border: 1px dashed var(--accent);
}

.variables {
  font-size: 0.8rem;
  color: var(--text-light);
  font-style: italic;
}

.call-to-action {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--accent-background);
  border-radius: 0.5rem;
  border: 2px dashed var(--accent);
}

.cta-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--accent);
  font-weight: 500;
}

.add-text-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  width: auto;
}

.add-text-btn:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-text-btn:active {
  transform: translateY(0);
}

code {
  background: var(--accent-background);
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--accent);
}

.privacy-list,
.performance-list,
.github-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.privacy-list li,
.performance-list li,
.github-list li {
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border);
  position: relative;
  padding-left: 1.5rem;
}

.privacy-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: bold;
}

.performance-list li::before {
  content: '⚡';
  position: absolute;
  left: 0;
}

.github-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: bold;
}

.github-full-width {
  margin: 2rem 0;
}

.github-card {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: var(--accent-background);
  text-align: center;
}

.github-card h3 {
  margin-bottom: 1rem;
  color: var(--accent);
}

.github-benefits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .github-benefits {
    grid-template-columns: 1fr;
  }
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.github-link:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.github-link:active {
  transform: translateY(0);
}

.welcome-container .example-text span,
.welcome-container .snippet-text span {
  background: var(--accent-background);
  color: var(--accent);
  font-family: monospace;
  font-weight: 600;
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .privacy-benefits,
  .pwa-benefits {
    grid-template-columns: 1fr;
  }

  .variable-form {
    flex-direction: column;
  }

  .snippet-preview {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .snippet-text {
    margin-right: 0;
  }

  .snippet-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
