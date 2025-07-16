import { useLayoutEffect, useEffect, useRef, useState } from 'react';

// 共享的列表项组件
const ListItem = ({ item, delay = 0, highlight = false }) => {
  return (
    <div 
      className={`comparison-list-item ${highlight ? 'highlight' : ''}`}
      style={{ 
        animationDelay: `${delay}ms`,
        backgroundColor: highlight ? '#ffeb3b' : `hsl(${item * 30}, 70%, 90%)`,
        transform: highlight ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      项目 {item}
      {highlight && <span className="highlight-badge">新增</span>}
    </div>
  );
};

// 使用 useLayoutEffect 的组件
const UseLayoutEffectComponent = ({ items, lastAddedItem }) => {
  const listRef = useRef(null);
  const prevHeightRef = useRef(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // 模拟一些计算密集型操作
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += Math.random();
    }

    // 保存更新前的高度
    const prevHeight = prevHeightRef.current;
    const currentHeight = list.offsetHeight;

    // 触发闪烁效果指示器
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
    
    // 如果高度变化，设置过渡动画
    if (prevHeight && prevHeight !== currentHeight) {
      list.style.height = `${prevHeight}px`;
      // 强制回流后应用实际高度，触发过渡
      requestAnimationFrame(() => {
        list.style.height = `${currentHeight}px`;
      });
    }
    
    // 保存当前高度供下次使用
    prevHeightRef.current = currentHeight;

    // 清除样式，让元素恢复自然高度
    return () => {
      list.style.height = '';
    };
  }, [items]);

  return (
    <div className="comparison-section">
      <h3>
        useLayoutEffect 
        {isFlashing && <span className="flash-indicator layout-flash">🔄</span>}
      </h3>
      <div ref={listRef} className="comparison-list">
        {items.map((item, index) => (
          <ListItem 
            key={item} 
            item={item} 
            delay={index * 30}
            highlight={item === lastAddedItem}
          />
        ))}
      </div>
    </div>
  );
};

// 使用 useEffect 的组件
const UseEffectComponent = ({ items, lastAddedItem }) => {
  const listRef = useRef(null);
  const prevHeightRef = useRef(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // 模拟一些计算密集型操作
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += Math.random();
    }

    // 保存更新前的高度
    const prevHeight = prevHeightRef.current;
    const currentHeight = list.offsetHeight;


    // 触发闪烁效果指示器
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    // 模拟可能的闪烁
    if (prevHeight && prevHeight !== currentHeight) {
      // 添加临时的闪烁效果
      list.style.opacity = '0.5';
      setTimeout(() => {
        list.style.opacity = '1';
      }, 50);
    }
    
    // 如果高度变化，设置过渡动画
    if (prevHeight && prevHeight !== currentHeight) {
      list.style.height = `${prevHeight}px`;
      // 强制回流后应用实际高度，触发过渡
      requestAnimationFrame(() => {
        list.style.height = `${currentHeight}px`;
      });
    }
    
    // 保存当前高度供下次使用
    prevHeightRef.current = currentHeight;

    // 清除样式，让元素恢复自然高度
    return () => {
      list.style.height = '';
    };
  }, [items]);

  return (
    <div className="comparison-section">
      <h3>
        useEffect 
        {isFlashing && <span className="flash-indicator effect-flash">⚡</span>}
      </h3>
      <div ref={listRef} className="comparison-list effect-list">
        {items.map((item, index) => (
          <ListItem 
            key={item} 
            item={item} 
            delay={index * 30}
            highlight={item === lastAddedItem}
          />
        ))}
      </div>
    </div>
  );
};

const ComparisonDemo = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const rapidAddItems = () => {
    setIsAnimating(true);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setItems(current => [...current, current.length + 1]);
      }, i * 100);
    }
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="comparison-demo">

      <div className="controls">
        <button onClick={rapidAddItems} className="btn btn-warning" disabled={isAnimating}>
          快速连续添加
        </button>
      </div>

      <div className="comparison-container">
        <UseLayoutEffectComponent items={items} lastAddedItem={lastAddedItem} />
        <UseEffectComponent items={items} lastAddedItem={lastAddedItem} />
      </div>
    </div>
  );
};

export default ComparisonDemo; 