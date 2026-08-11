// src/components/modals/AlgorithmGameModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

const ALGO_LEVELS = [
  {
    id: 'flow',
    title: 'Level 1: Flow Matching Velocity Field 🌊',
    algo: 'Conditional Flow Matching (Lipman et al.)',
    task: 'Select the optimal ODE integration solver to reach the target data distribution with minimum function evaluations (NFE):',
    options: [
      { text: 'Euler Solver (NFE=50)', correct: false, exp: 'Euler works but requires 50+ steps for curved paths.' },
      { text: 'Optimal Transport Straight Path + Midpoint (NFE=15)', correct: true, exp: 'Correct! OT straight paths allow simulation-free ODE integration in just 15 steps!' },
      { text: 'SDE Noise Schedule Diffusion (NFE=1000)', correct: false, exp: 'Diffusion SDEs are far too slow compared to CFM.' },
    ]
  },
  {
    id: 'grpo',
    title: 'Level 2: GRPO Policy Alignment 🎯',
    algo: 'Group Relative Policy Optimization (DeepSeek R1)',
    task: 'For a prompt group of G=4 rollouts with rewards [0.9, 0.2, 0.8, 0.1], which rollout receives the highest positive advantage A_i?',
    options: [
      { text: 'Rollout 1 (Reward = 0.9)', correct: true, exp: 'Correct! Rollout 1 exceeds the group mean μ_r=0.5, giving it the maximum positive advantage +Adv!' },
      { text: 'Rollout 4 (Reward = 0.1)', correct: false, exp: 'Incorrect. Reward 0.1 is below average, resulting in negative advantage -Adv.' },
      { text: 'All rollouts receive equal advantage', correct: false, exp: 'Incorrect. GRPO normalizes advantages relative to group mean and std.' },
    ]
  },
  {
    id: 'cuda',
    title: 'Level 3: CUDA Warp Tree Reduction ⚡',
    algo: 'Fused CUDA Warp Reduction Kernel',
    task: 'In a 32-thread CUDA warp executing __shfl_xor_sync(mask, val, delta), what offset delta is used in the first reduction step?',
    options: [
      { text: 'delta = 1', correct: false, exp: 'delta=1 is the final step in a warp tree reduction.' },
      { text: 'delta = 16 (WARP / 2)', correct: true, exp: 'Correct! Thread 0 pairs with Thread 16, Thread 1 pairs with Thread 17 down to delta=1!' },
      { text: 'delta = 32', correct: false, exp: 'delta=32 is outside the 32-thread warp bounds.' },
    ]
  },
  {
    id: 'svd',
    title: 'Level 4: Linear SVD Attention 📐',
    algo: 'Sub-Quadratic Linear Attention (Katharopoulos et al.)',
    task: 'On a sequence of length N=65,536 tokens, how does Linear SVD Attention avoid the O(N²) memory bottleneck?',
    options: [
      { text: 'By computing (Q K^T) V softmax matrix first', correct: false, exp: 'Materializing (Q K^T) creates a massive 65536×65536 matrix (O(N²)).' },
      { text: 'By re-associating to Q (K^T V) using SVD rank r projection', correct: true, exp: 'Correct! Multiplying K^T @ V first reduces memory complexity from O(N²) down to O(N·r)!' },
      { text: 'By dropping 90% of tokens randomly', correct: false, exp: 'Dropping tokens destroys context quality.' },
    ]
  },
  {
    id: 'unlearning',
    title: 'Level 5: Null-Space Machine Unlearning 🧹',
    algo: 'Concept Erasure via Null-Space Projection',
    task: 'To erase a sensitive concept representation U_k from weight matrix W, which projection matrix is applied?',
    options: [
      { text: 'W_clean = W (I - U_k U_k^T)', correct: true, exp: 'Correct! Multiplying by (I - U_k U_k^T) projects weights onto the null-space, zeroing out concept activations!' },
      { text: 'W_clean = W + U_k', correct: false, exp: 'Adding concept vectors amplifies the target concept.' },
      { text: 'W_clean = 0', correct: false, exp: 'Zeroing out all weights destroys all model capabilities.' },
    ]
  },
  {
    id: 'iit',
    title: 'Level 6: Integrated Information Φ 🧠',
    algo: 'Integrated Information Theory (IIT 4.0)',
    task: 'What condition indicates that a synthetic cognitive network possesses irreducibly integrated cause-effect power?',
    options: [
      { text: 'Φ > 0.0 (EI of Whole > EI of Minimum Information Partition)', correct: true, exp: 'Correct! Φ > 0 proves the system as a whole generates more cause-effect info than its MIP cut!' },
      { text: 'Φ = 0.0', correct: false, exp: 'Φ = 0 means the system is completely reducible to independent parts.' },
      { text: 'Φ < 0.0', correct: false, exp: 'Φ is non-negative by definition.' },
    ]
  }
];

export default function AlgorithmGameModal({ open, onClose, showToast, beep }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (!open) return null;

  const currentLevel = ALGO_LEVELS[levelIdx];

  const handleSelect = (optIdx) => {
    if (answered) return;
    setSelectedOpt(optIdx);
    setAnswered(true);
    const isCorrect = currentLevel.options[optIdx].correct;

    if (isCorrect) {
      setScore(s => s + 500);
      beep?.(880, 'sine');
      showToast?.('🎉 Correct Answer! +500 Algorithm Master XP!');
    } else {
      beep?.(300, 'sawtooth');
      showToast?.('❌ Incorrect! Read explanation to learn.');
    }
  };

  const handleNext = () => {
    if (levelIdx < ALGO_LEVELS.length - 1) {
      setLevelIdx(l => l + 1);
      setSelectedOpt(null);
      setAnswered(false);
      beep?.(700);
    } else {
      beep?.(1000, 'sine');
      showToast?.(`🏆 ALGORITHM MASTER CERTIFICATE EARNED! Score: ${score} XP`);
      setLevelIdx(0);
      setScore(0);
      setSelectedOpt(null);
      setAnswered(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">🎮 Interactive Educational Game</div>
      <h2 style={{ color: '#fff', marginBottom: '.5rem' }}>AI Algorithm Quest 🧪</h2>
      <div className="algo-game-progress">
        <span>Level {levelIdx + 1} of {ALGO_LEVELS.length}</span>
        <span style={{ color: 'var(--emerald)', fontFamily: 'monospace' }}>Score: {score} XP</span>
      </div>

      <div className="algo-game-card">
        <div className="algo-game-algo-badge">{currentLevel.algo}</div>
        <h3 className="algo-game-title">{currentLevel.title}</h3>
        <p className="algo-game-task">{currentLevel.task}</p>

        <div className="algo-game-options">
          {currentLevel.options.map((opt, i) => {
            let stateClass = '';
            if (answered) {
              if (opt.correct) stateClass = 'correct';
              else if (selectedOpt === i) stateClass = 'wrong';
            }
            return (
              <button
                key={i}
                className={`algo-opt-btn ${stateClass}`}
                onClick={() => handleSelect(i)}
                disabled={answered}>
                <span>{opt.text}</span>
                {answered && opt.correct && <i className="fas fa-check-circle" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="algo-game-explanation">
            <b>{currentLevel.options[selectedOpt].correct ? '✓ Knowledge Unlocked:' : '💡 Learning Insight:'}</b>
            <p>{currentLevel.options[selectedOpt].exp}</p>
            <button className="btn-primary" onClick={handleNext} style={{ marginTop: '.8rem', width: '100%', justifyContent: 'center' }}>
              {levelIdx < ALGO_LEVELS.length - 1 ? 'Next Level ➡️' : 'Claim Master Certificate 🏆'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
