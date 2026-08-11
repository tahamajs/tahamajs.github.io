// src/components/sections/SocialFeedSection.jsx
import SectionHead from '../ui/SectionHead.jsx';

const TWEETS = [
  {
    author: 'Hoosha AI 🧠',
    handle: '@hooshaaii',
    avatar: 'https://github.com/tahamajs.png',
    date: 'Aug 10, 2026',
    text: 'Unpacking Conditional Flow Matching (CFM): Why simulation-free continuous normalizing flows outperform standard diffusion SDEs in sample efficiency and ODE solver integration steps. 🧵 (1/8)',
    stats: { retweets: '142', likes: '890', replies: '34' },
    url: 'https://x.com/hooshaaii',
    tag: 'Flow Matching'
  },
  {
    author: 'Hoosha AI 🧠',
    handle: '@hooshaaii',
    avatar: 'https://github.com/tahamajs.png',
    date: 'Aug 4, 2026',
    text: 'Deep-dive on GRPO (Group Relative Policy Optimization): Eliminating the PPO Critic network for 4B LLM math reasoning. How group-normalized rewards scale alignment training on constrained GPU clusters. 🚀',
    stats: { retweets: '215', likes: '1.2k', replies: '58' },
    url: 'https://x.com/hooshaaii',
    tag: 'GRPO Alignment'
  },
  {
    author: 'Mohammad Taha Majlesi',
    handle: '@tahamajlesi',
    avatar: 'assets/avatar.jpg',
    date: 'Jul 28, 2026',
    text: 'Announcing Kaleido Engine v0.4 ⚡ — First-principles 4D-parallel CUDA 12.2 / C++ distributed LLM training framework. Fused warp-level reduction kernels achieving near-peak 1.8 TB/s memory bandwidth on A100 SXM4.',
    stats: { retweets: '310', likes: '1.8k', replies: '72' },
    url: 'https://x.com/hooshaaii',
    tag: 'CUDA Systems'
  },
  {
    author: 'Hoosha AI 🧠',
    handle: '@hooshaaii',
    avatar: 'https://github.com/tahamajs.png',
    date: 'Jul 15, 2026',
    text: 'Released 162 HuggingFace Assets! 92 pre-trained model weights + 70 synthetic evaluation datasets for Persian LLM benchmarks and sub-quadratic linear attention research. Open for the global community.',
    stats: { retweets: '188', likes: '940', replies: '41' },
    url: 'https://huggingface.co/tahamajs',
    tag: 'Open Science'
  }
];

export default function SocialFeedSection({ beep }) {
  return (
    <section id="social-feed" className="section fade-up">
      <SectionHead
        tag="Research Dispatch &amp; X Feed"
        title="Latest Updates from <b>@hooshaaii</b> 🐦"
        sub="Follow live dispatches on Flow Matching, GRPO post-training, CUDA kernel optimization, and Hugging Face releases."
      />

      <div className="tweets-grid">
        {TWEETS.map((t, i) => (
          <a key={i} href={t.url} target="_blank" className="tweet-card" onClick={() => beep?.()}>
            <div className="tweet-header">
              <img src={t.avatar} onError={e=>{e.target.src='https://github.com/tahamajs.png';}} alt={t.author} className="tweet-avatar" />
              <div>
                <div className="tweet-author">{t.author} <i className="fas fa-check-circle tweet-badge" /></div>
                <div className="tweet-handle">{t.handle} · {t.date}</div>
              </div>
              <span className="tweet-tag">{t.tag}</span>
            </div>
            <p className="tweet-body">{t.text}</p>
            <div className="tweet-footer">
              <span><i className="far fa-comment" /> {t.stats.replies}</span>
              <span><i className="fas fa-retweet" /> {t.stats.retweets}</span>
              <span><i className="far fa-heart" /> {t.stats.likes}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}><i className="fab fa-x-twitter" /> View on X</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
