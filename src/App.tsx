import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

import { Header } from "./components/header";
import { Mandalart } from "./components/mandal-art";
import { ToastAction } from "./components/ui/toast";

function App() {
  const { toast } = useToast();

  // INFO: 임시로 개발중임을 알리는 토스트를 띄웁니다.
  useEffect(() => {
    const isDismissed = localStorage.getItem("mandalart-isDismissed");
    if (isDismissed) return;
    toast({
      title: "현재는 개발 진행중입니다.",
      description: "UI가 정상적으로 보이지 않으면 데이터를 삭제하고 다시 시도해보세요.",
      duration: 5000,
      action: (
        <ToastAction
          onClick={() => {
            localStorage.setItem("mandalart-isDismissed", "true");
          }}
          altText="다시보지않기"
        >
          다시보지않기
        </ToastAction>
      ),
    });
  }, [toast]);

  return (
    <div className="flex items-center justify-center w-full h-dvh h-vh">
      <Header />
      <Mandalart />
    </div>
  );
}

export default App;
