"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Star, StarOff, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";
import type { HistoryItem } from "@/types";

interface HistoryManagerProps {
  onLoadHistory: (item: HistoryItem) => void;
}

export function HistoryManager({ onLoadHistory }: HistoryManagerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // localStorage에서 히스토리 로드
  useEffect(() => {
    const loadedHistory = localStorage.getItem("generationHistory");
    if (loadedHistory) {
      try {
        setHistory(JSON.parse(loadedHistory));
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
  }, [isOpen]); // 다이얼로그 열 때마다 새로고침

  // 히스토리 필터링
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.valueProposition
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  // 즐겨찾기 토글
  const toggleFavorite = (id: string) => {
    const updatedHistory = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updatedHistory);
    localStorage.setItem("generationHistory", JSON.stringify(updatedHistory));
    toast.success("즐겨찾기가 업데이트되었습니다.");
  };

  // 히스토리 삭제
  const deleteHistory = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("generationHistory", JSON.stringify(updatedHistory));
    toast.success("히스토리가 삭제되었습니다.");
  };

  // 전체 히스토리 삭제
  const clearAllHistory = () => {
    if (confirm("정말로 모든 히스토리를 삭제하시겠습니까?")) {
      setHistory([]);
      localStorage.removeItem("generationHistory");
      toast.success("모든 히스토리가 삭제되었습니다.");
    }
  };

  // 히스토리 불러오기
  const handleLoadHistory = (item: HistoryItem) => {
    onLoadHistory(item);
    setIsOpen(false);
    toast.success("히스토리를 불러왔습니다!");
  };

  const favoriteCount = history.filter((item) => item.isFavorite).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          히스토리 ({history.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              생성 히스토리
              <Badge variant="secondary">{history.length}개</Badge>
              {favoriteCount > 0 && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  {favoriteCount}
                </Badge>
              )}
            </div>
            {history.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllHistory}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                전체 삭제
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* 필터 */}
        <div className="flex gap-2 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="가치 제언 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="w-4 h-4 mr-1" />
            즐겨찾기만
          </Button>
        </div>

        {/* 히스토리 리스트 */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm || showFavoritesOnly
                  ? "검색 결과가 없습니다."
                  : "아직 생성 히스토리가 없습니다."}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(item.timestamp).toLocaleString("ko-KR")}
                      </p>
                      <p className="font-medium">{item.valueProposition}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        {item.isFavorite ? (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHistory(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.formData.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                    <Badge variant="outline">
                      {item.result.generated_copies.length}개 생성
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLoadHistory(item)}
                    className="w-full"
                  >
                    불러오기
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

