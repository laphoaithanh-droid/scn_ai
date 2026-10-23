import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SeatingChart } from './components/SeatingChart';
import { DailyTracker } from './components/DailyTracker';
import { AIReportAssistant } from './components/AIReportAssistant';
import { LessonPlanner } from './components/LessonPlanner';
import { ParentMeetingKit } from './components/ParentMeetingKit';
import { FourPillarsAutomation } from './components/FourPillarsAutomation';
import { ClassroomChatbot } from './components/ClassroomChatbot';
import { BilingualHub } from './components/BilingualHub';
import { StudentPortal } from './components/StudentPortal';
import { LoginModal } from './components/LoginModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { EwsRadarModal } from './components/EwsRadarModal';
import { QuickStudentModal } from './components/QuickStudentModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { DataManagementView } from './components/DataManagementView';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { getStoredApiKey } from './services/geminiService';
import { Student } from './types';
import { Users, Key, Sparkles, Lock, KeyRound } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isUsingDefaultPassword } = useApp();
  const [activeTab, setActiveTab] = useState<string>('seating');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isEwsModalOpen, setIsEwsModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [luckyWheelScope, setLuckyWheelScope] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isMandatoryApiKey, setIsMandatoryApiKey] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  const handleOpenLuckyWheel = (scope?: 'all' | 1 | 2 | 3 | 4) => {
    setLuckyWheelScope(scope || 'all');
    setIsLuckyWheelOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Bar */}
      <Header
        onOpenLogin={() => setIsLoginModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEwsModal={() => setIsEwsModalOpen(true)}
        onOpenGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
        onOpenApiKeyModal={() => {
          setIsMandatoryApiKey(false);
          setIsApiKeyModalOpen(true);
        }}
        onOpenLuckyWheel={() => handleOpenLuckyWheel('all')}
        onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Warning Banner if using default password */}
        {currentUser && role === 'teacher' && isUsingDefaultPassword && (
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/50 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs animate-in fade-in duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-300 block">
                  Khuyến nghị bảo mật lớp học:
                </span>
                <span className="text-slate-300 text-[11px]">
                  Tài khoản lớp {currentUser.className} đang dùng mật khẩu mặc định (<code>Abc123@</code>). Thầy/Cô vui lòng đổi sang mật khẩu cá nhân để bảo mật dữ liệu học sinh.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/30 transition whitespace-nowrap self-start sm:self-auto flex items-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đổi Mật Khẩu Ngay</span>
            </button>
          </div>
        )}
        {/* Guest Banner if not logged in */}
        {!currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <span>Chế Độ Khách / Học Sinh (Bộ Dữ Liệu Chuẩn)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                    Xem trước
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Dành cho Giáo viên Chủ nhiệm: Đăng nhập theo mã lớp (ví dụ: <code className="text-amber-300 font-mono">lop3c1_2026</code>, <code className="text-amber-300 font-mono">lop4a1_2026</code>) để kích hoạt không gian quản trị và tự động lưu trữ dữ liệu riêng.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition whitespace-nowrap flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Đăng Nhập Quản Trị Lớp</span>
            </button>
          </div>
        )}

        {role === 'student' ? (
          <StudentPortal />
        ) : (
          <div>
            {activeTab === 'seating' && (
              <SeatingChart
                onSelectStudent={(s) => setSelectedStudentForModal(s)}
                onOpenLuckyWheel={handleOpenLuckyWheel}
              />
            )}
            {activeTab === 'tracker' && (
              <DailyTracker onSelectStudent={(s) => setSelectedStudentForModal(s)} />
            )}
            {activeTab === 'tt27' && (
              <AIReportAssistant onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
            )}
            {activeTab === 'planner' && <LessonPlanner />}
            {activeTab === 'parent' && <ParentMeetingKit />}
            {activeTab === 'automation' && <FourPillarsAutomation />}
            {activeTab === 'chatbot' && <ClassroomChatbot />}
            {activeTab === 'bilingual' && <BilingualHub />}
            {activeTab === 'data-management' && <DataManagementView />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <p>
          SỔ CHỦ NHIỆM AI © 2026 • Trợ lý số hóa quản trị lớp học chuẩn Thông tư 27 Bộ GD&ĐT & Bộ sách Kết Nối Tri Thức Với Cuộc Sống
        </p>
      </footer>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <GoogleSheetModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
      />

      <EwsRadarModal
        isOpen={isEwsModalOpen}
        onClose={() => setIsEwsModalOpen(false)}
        onSelectStudent={(s) => setSelectedStudentForModal(s)}
      />

      <QuickStudentModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        isMandatory={isMandatoryApiKey}
      />

      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        initialScope={luckyWheelScope}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
