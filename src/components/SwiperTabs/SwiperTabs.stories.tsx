import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SwiperTabs from './SwiperTabs';
import { SwiperTabItem } from '../../types/swiper.types';

const meta: Meta<typeof SwiperTabs> = {
  title: 'Components/SwiperTabs',
  component: SwiperTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '스와이프 가능한 탭 네비게이션 컴포넌트입니다. 활성화된 탭이 항상 보이도록 자동 스크롤됩니다.',
      },
    },
  },
  argTypes: {
    tabs: {
      description: '탭 아이템 목록',
      control: { type: 'object' },
    },
    activeTabId: {
      description: '현재 활성화된 탭의 ID',
      control: { type: 'text' },
    },
    showNavigation: {
      description: '좌우 네비게이션 버튼 표시 여부',
      control: { type: 'boolean' },
    },
    spaceBetween: {
      description: '탭 간격 (px)',
      control: { type: 'number', min: 0, max: 50 },
    },
    slidesPerView: {
      description: '한 번에 보여질 탭 개수',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SwiperTabs>;

/**
 * 기본 탭 데이터 생성 함수
 */
const generateTabs = (count: number): SwiperTabItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `tab-${i + 1}`,
    label: `탭 ${i + 1}`,
  }));
};

/**
 * 기본 예제
 */
export const Default: Story = {
  args: {
    tabs: generateTabs(5),
    activeTabId: 'tab-1',
    showNavigation: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '200px' }}>
        <SwiperTabs
          {...args}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: {activeTab}</p>
        </div>
      </div>
    );
  },
};

/**
 * 많은 탭이 있는 경우
 */
export const ManyTabs: Story = {
  args: {
    tabs: generateTabs(20),
    activeTabId: 'tab-10',
    showNavigation: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '200px' }}>
        <h3 style={{ marginBottom: '20px' }}>많은 탭이 있는 경우 (20개)</h3>
        <SwiperTabs
          {...args}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: {activeTab}</p>
          <p>활성 탭이 자동으로 중앙에 위치합니다.</p>
        </div>
      </div>
    );
  },
};

/**
 * 네비게이션 없는 경우
 */
export const WithoutNavigation: Story = {
  args: {
    tabs: generateTabs(10),
    activeTabId: 'tab-1',
    showNavigation: false,
    spaceBetween: 8,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '200px' }}>
        <h3 style={{ marginBottom: '20px' }}>네비게이션 버튼 없음</h3>
        <SwiperTabs
          {...args}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: {activeTab}</p>
          <p>스와이프로만 이동 가능합니다.</p>
        </div>
      </div>
    );
  },
};

/**
 * 긴 텍스트 탭
 */
export const LongTextTabs: Story = {
  args: {
    tabs: [
      { id: 'overview', label: '개요' },
      { id: 'specifications', label: '상세 스펙' },
      { id: 'reviews', label: '리뷰 및 평가' },
      { id: 'related', label: '관련 상품 추천' },
      { id: 'qa', label: '자주 묻는 질문' },
      { id: 'shipping', label: '배송 및 교환/반품' },
      { id: 'warranty', label: '품질보증 및 A/S' },
    ],
    activeTabId: 'reviews',
    showNavigation: true,
    spaceBetween: 12,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '200px' }}>
        <h3 style={{ marginBottom: '20px' }}>다양한 길이의 탭 텍스트</h3>
        <SwiperTabs
          {...args}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: {activeTab}</p>
        </div>
      </div>
    );
  },
};

/**
 * 동적 탭 추가/삭제 예제
 */
export const DynamicTabs: Story = {
  args: {
    tabs: generateTabs(3),
    activeTabId: 'tab-1',
    showNavigation: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [tabs, setTabs] = useState(args.tabs);
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    const [tabCounter, setTabCounter] = useState(args.tabs.length + 1);
    
    const addTab = () => {
      const newTab = {
        id: `tab-${tabCounter}`,
        label: `탭 ${tabCounter}`,
      };
      setTabs([...tabs, newTab]);
      setTabCounter(tabCounter + 1);
      // 새로 추가된 탭을 활성화
      setActiveTab(newTab.id);
    };
    
    const removeTab = () => {
      if (tabs.length > 1) {
        const newTabs = tabs.slice(0, -1);
        setTabs(newTabs);
        // 마지막 탭이 활성화되어 있었다면 이전 탭으로 이동
        if (activeTab === tabs[tabs.length - 1].id) {
          setActiveTab(newTabs[newTabs.length - 1].id);
        }
      }
    };
    
    const addTabAtBeginning = () => {
      const newTab = {
        id: `tab-${tabCounter}`,
        label: `새 탭 ${tabCounter}`,
      };
      setTabs([newTab, ...tabs]);
      setTabCounter(tabCounter + 1);
      setActiveTab(newTab.id);
    };
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '300px' }}>
        <h3 style={{ marginBottom: '20px' }}>동적 탭 추가/삭제 테스트</h3>
        
        {/* 컨트롤 버튼들 */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={addTab}
            style={{ 
              padding: '8px 16px', 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            끝에 탭 추가
          </button>
          <button 
            onClick={addTabAtBeginning}
            style={{ 
              padding: '8px 16px', 
              background: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            처음에 탭 추가
          </button>
          <button 
            onClick={removeTab}
            style={{ 
              padding: '8px 16px', 
              background: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: tabs.length <= 1 ? 0.5 : 1
            }}
            disabled={tabs.length <= 1}
          >
            마지막 탭 삭제
          </button>
          <span style={{ 
            padding: '8px 16px', 
            background: 'white', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            현재 탭 개수: {tabs.length}개
          </span>
        </div>
        
        {/* Swiper 탭 */}
        <div style={{ background: 'white', padding: '10px', borderRadius: '8px', overflow: 'hidden' }}>
          <SwiperTabs
            {...args}
            tabs={tabs}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        {/* 정보 표시 */}
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: <strong>{activeTab}</strong></p>
          <p>탭을 추가하면 자동으로 새 탭이 활성화되고 보이는 위치로 스크롤됩니다.</p>
          <p>오른쪽에 추가된 탭이 잘 보이는지 확인해보세요.</p>
        </div>
      </div>
    );
  },
};

/**
 * 다양한 너비에서 테스트
 */
export const VariousWidths: Story = {
  args: {
    tabs: generateTabs(15),
    activeTabId: 'tab-8',
    showNavigation: true,
    spaceBetween: 8,
    slidesPerView: 'auto',
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTabId);
    
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '200px' }}>
        <h3 style={{ marginBottom: '20px' }}>다양한 컨테이너 너비에서 테스트</h3>
        
        <div style={{ marginBottom: '30px' }}>
          <h4>100% 너비</h4>
          <div style={{ width: '100%', background: 'white', padding: '10px', borderRadius: '8px' }}>
            <SwiperTabs
              {...args}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h4>800px 너비</h4>
          <div style={{ width: '800px', background: 'white', padding: '10px', borderRadius: '8px' }}>
            <SwiperTabs
              {...args}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h4>500px 너비</h4>
          <div style={{ width: '500px', background: 'white', padding: '10px', borderRadius: '8px' }}>
            <SwiperTabs
              {...args}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
        
        <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <p>선택된 탭: {activeTab}</p>
          <p>각 탭은 240px 고정 너비를 가지며, 컨테이너 너비에 따라 보이는 탭 개수가 자동 조절됩니다.</p>
        </div>
      </div>
    );
  },
};