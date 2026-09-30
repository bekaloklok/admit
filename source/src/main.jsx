import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, CircleHelp, Hand, ImagePlus, RotateCcw, ScanLine, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import './index.css'

const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')
const imageNames = 'a b v g d e - zh z i j k l m n o p r s t u f h ts ch sh shch tvjordyj-znak y myagkij-znak ee yu ya'.split(' ')
const motionLetters = new Set(['Д', 'Ё', 'Й', 'К', 'Щ', 'Ъ', 'Ь'])
const movementHelp = {
  'Д': 'Выпрями и соедини указательный со средним, остальные пальцы согни. Затем нарисуй двумя пальцами маленький круг в воздухе.',
  'Ё': 'Сложи пальцы как для Е, затем поверни кисть влево и вправо.',
  'Й': 'Покажи форму И: безымянный палец и мизинец вверх, указательный и средний согнуты. Затем поверни кисть дугой в сторону.',
  'К': 'Выпрями и слегка разведи указательный и средний пальцы. Согни безымянный и мизинец, затем коротко опусти кисть вниз.',
  'Щ': 'Покажи форму Ш, затем коротко опусти кисть вниз.',
  'Ъ': 'Сложи пальцы как для Г. Слегка наклони кисть: указательный палец уходит к тебе, от камеры.',
  'Ь': 'Сложи пальцы как для Г. Слегка наклони кисть: указательный палец уходит от тебя, к камере.',
}
const movementLabels = { 'Д': 'Круг двумя пальцами', 'Ё': 'Поворот туда и обратно', 'Й': 'Поворот кисти', 'К': 'Кисть вниз', 'Щ': 'Кисть вниз', 'Ъ': 'Наклон к себе', 'Ь': 'Наклон от себя' }
const movementSymbols = { 'Д': '◌', 'Ё': '↔', 'Й': '↶', 'К': '↓', 'Щ': '↓', 'Ъ': '•', 'Ь': '•' }

function App() {
  const [selected, setSelected] = useState(0)
  const selectedLetter = letters[selected]
  const selectedImage = imageNames[selected]
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = './app.js'
    document.body.append(script)
    return () => script.remove()
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Hand size={20} strokeWidth={2.2} /></span>Жесты</div>
        <div className="topbar-right">
          <span className="topbar-note">Тренажёр русского дактиля</span>
          <Badge variant="outline">Алфавит · 33 буквы</Badge>
        </div>
      </header>

      <main>
        <section className="intro">
          <div className="intro-copy">
            <div className="eyebrow"><Sparkles size={15} /> Учись жестам с камерой</div>
            <h1>Покажи букву — получи ответ.</h1>
            <p>Изучи весь русский дактильный алфавит. Камера определяет форму руки для всех букв и подсказывает, какой палец поправить.</p>
          </div>
          <div className="intro-side"><CircleHelp size={16} /> 33 буквы · подсказки по пальцам</div>
        </section>

        <section className="lesson" aria-label="Урок">
          <Card className="lesson-card target-card">
            <CardContent className="lesson-card-body">
              <div className="card-head"><span>Твоё задание</span><Badge id="counter" variant="secondary">1 / 33</Badge></div>
              <div className="target-letter" id="targetLetter">А</div>
              <p className="target-title" id="targetTitle">Покажи букву А</p>
              <div className="reference"><img id="reference" className="upright-a" src="./references/alphabet/a.png" alt="Образец жеста А" /><span>Образец жеста</span></div>
              <p className="tiny" id="targetHint">Сожми пальцы в кулак, большой палец положи поверх. Держи запястье снизу, как на рисунке.</p>
            </CardContent>
          </Card>

          <Card className="lesson-card camera-card">
            <CardContent className="lesson-card-body">
              <div className="card-head"><span>Практика с камерой</span><span><i className="status-dot" /><span id="cameraState">Выключена</span></span></div>
              <div className="video-wrap">
                <video id="video" autoPlay playsInline muted />
                <div className="video-placeholder" id="videoPlaceholder"><span className="placeholder-icon"><Camera size={24} /></span><span>Включи камеру, чтобы начать практику</span></div>
                <div className="video-pill" id="videoPill">Ожидание руки</div>
              </div>
              <div className="camera-actions">
                <Button id="startButton" type="button" className="primary-action" disabled><Camera size={16} /> Включить камеру</Button>
                <label className="upload-button"><ImagePlus size={16} /> Загрузить фото <input id="imageInput" type="file" accept="image/*" disabled /></label>
                <Button id="exampleButton" type="button" variant="outline" disabled><ScanLine size={16} /> Проверить образец</Button>
              </div>
              <div className="feedback" aria-live="polite">
                <div className="feedback-icon" id="feedbackIcon">✳</div>
                <div><strong id="feedbackTitle">Готовимся к уроку</strong><p id="feedbackText">Загрузка модели…</p></div>
              </div>
            </CardContent>
          </Card>

          <Card className="lesson-card analysis-card">
            <CardContent className="lesson-card-body">
              <div className="card-head"><span>Анализ жеста</span><ScanLine size={17} /></div>
              <div className="analysis-stage"><canvas id="skeleton" width="192" height="192" aria-label="Контур обнаруженной руки" /></div>
              <div className="prediction"><span>Распознано</span><strong id="prediction">—</strong></div>
              <div className="meter"><span id="meterFill" /></div>
              <p className="tiny" id="confidence">Наведите руку на камеру</p>
            </CardContent>
          </Card>
        </section>

        <section className="alphabet-section" aria-label="Русский дактильный алфавит">
          <div className="alphabet-heading"><div><span className="eyebrow">Справочник жестов</span><h2>Весь алфавит</h2></div><Badge variant="secondary">33 буквы</Badge></div>
          <p className="alphabet-intro">Выбери букву и нажми «Тренировать». Для Д, Ё, Й, К, Щ, Ъ и Ь нужна камера: одно фото не показывает движение.</p>
          <div className="alphabet-layout">
            <div className="alphabet-grid">
              {letters.map((letter, index) => (
                <button key={letter} className={`alphabet-key ${selected === index ? 'selected' : ''}`} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`Буква ${letter}`}>
                  <strong>{letter}</strong><span>{movementSymbols[letter] || ''}</span>
                </button>
              ))}
            </div>
            <Card className="alphabet-preview"><CardContent className="alphabet-preview-body">
              <div className="alphabet-preview-top"><strong>{selectedLetter}</strong><Badge variant={motionLetters.has(selectedLetter) ? 'secondary' : 'default'}>{motionLetters.has(selectedLetter) ? 'Нужна камера и движение' : 'Можно проверить камерой'}</Badge></div>
              <img className={selectedLetter === 'А' ? 'upright-a' : undefined} src={`./references/alphabet/${selectedImage === '-' ? 'e' : selectedImage}.png`} alt={`Положение руки для буквы ${selectedLetter}${selectedLetter === 'Ё' ? ' (основа жеста Е)' : ''}`} />
              {movementHelp[selectedLetter] && <div className="motion-note"><strong>{movementLabels[selectedLetter]}</strong><span>{movementHelp[selectedLetter]}</span></div>}
              <p className="alphabet-caption">Рисунки: <a href="https://abvgdee.ru/alfavity/gluhonemyh" target="_blank" rel="noreferrer">Русский алфавит</a>. {selectedLetter === 'Ё' ? <>Движение Ё: <a href="https://infourok.ru/daktilnaya-azbuka-v-stihah-shag-navstrechu-5751737.html" target="_blank" rel="noreferrer">учебное описание</a>.</> : 'Для некоторых букв важно движение кисти.'}</p>
              <Button className="practice-selected" type="button" onClick={() => { window.dispatchEvent(new CustomEvent('practice-letter', { detail: selectedLetter })); document.querySelector('.lesson')?.scrollIntoView({ behavior: 'smooth' }) }}><Camera size={15} /> Тренировать букву {selectedLetter}</Button>
            </CardContent></Card>
          </div>
        </section>

        <section className="progress-section" aria-label="Прогресс урока">
          <div className="progress-heading"><h2>Твой прогресс</h2><span id="progressCount">0 из 33</span></div>
          <div className="progress-track"><span id="progressFill" /></div>
          <Button id="resetButton" type="button" variant="outline" className="reset-button" hidden><RotateCcw size={15} /> Пройти снова</Button>
        </section>
      </main>
      <Separator />
      <footer>Прототип урока по русскому дактилю · рисунки: <a href="https://abvgdee.ru/alfavity/gluhonemyh" target="_blank" rel="noreferrer">abvgdee.ru</a> · модель: <a href="https://github.com/Blockbattle/RSL-Dataset" target="_blank" rel="noreferrer">RSL-Dataset</a></footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
