import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/typography.css'
import './styles/desk-intro.css'
import './styles/reader.css'
import './styles/tape-article.css'
import './styles/project-cards.css'
import './styles/work-notebook.css'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
