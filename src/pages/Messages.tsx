import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical, Shield } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      lastMessage: "Is the MacBook still available?",
      time: "2m ago",
      unread: 2,
      item: "MacBook Pro 2021",
      verified: true
    },
    {
      id: 2,
      name: "Mike J.",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for the quick delivery!",
      time: "1h ago",
      unread: 0,
      item: "Calculus Textbook",
      verified: true
    },
    {
      id: 3,
      name: "Emma L.",
      avatar: "/placeholder.svg",
      lastMessage: "Can we meet at 3 PM?",
      time: "3h ago",
      unread: 1,
      item: "Study Desk",
      verified: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah M.",
      message: "Hi! I'm interested in your MacBook Pro. Is it still available?",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      message: "Yes, it's still available! It's in excellent condition, barely used.",
      time: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah M.",
      message: "Great! Can you tell me more about the battery life and any accessories included?",
      time: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      message: "Battery life is still excellent, holds charge for 8-10 hours. Includes original charger, box, and documentation.",
      time: "10:37 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Sarah M.",
      message: "Perfect! When can we meet for pickup?",
      time: "10:40 AM",
      isOwn: false
    }
  ];

  const currentConversation = conversations[selectedChat];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Chat securely with buyers and sellers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-10" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conversation, index) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50 ${
                          selectedChat === index ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedChat(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <img
                              src={conversation.avatar}
                              alt={conversation.name}
                              className="w-10 h-10 rounded-full"
                            />
                            {conversation.verified && (
                              <Shield className="w-3 h-3 text-success absolute -top-1 -right-1 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-foreground truncate">
                                {conversation.name}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {conversation.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-1">
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-primary truncate">
                              Re: {conversation.item}
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={currentConversation.avatar}
                          alt={currentConversation.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {currentConversation.verified && (
                          <Shield className="w-3 h-3 text-success absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {currentConversation.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          About: {currentConversation.item}
                        </p>
                      </div>
                      {currentConversation.verified && (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          Verified Student
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          // Handle send message
                          setNewMessage("");
                        }
                      }}
                    />
                    <Button>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    🔒 All messages are encrypted and secure
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
