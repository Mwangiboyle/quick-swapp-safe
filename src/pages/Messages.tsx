import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical, Shield, Loader2, MessageCircle } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";
import { useCurrentProfile, useConversations, useConversationMessages, useSendMessage } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { toast } = useToast();
  const { data: profile } = useCurrentProfile();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations(profile?.id || '');
  const sendMessageMutation = useSendMessage();

  // Process conversations data to get unique conversations
  const conversations = conversationsData?.data ? 
    Object.values(
      conversationsData.data.reduce((acc: any, message: any) => {
        const conversationId = message.conversation_id;
        if (!acc[conversationId] || new Date(message.created_at) > new Date(acc[conversationId].lastMessageDate)) {
          // Determine if current user is sender or receiver
          const isCurrentUserSender = message.sender_id === profile?.id;
          const otherUser = isCurrentUserSender ? message.receiver : message.sender;
          
          acc[conversationId] = {
            id: conversationId,
            name: `${otherUser?.first_name || ''} ${otherUser?.last_name || ''}`.trim() || 'Unknown User',
            avatar: otherUser?.avatar_url || "/placeholder.svg",
            lastMessage: message.message,
            time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lastMessageDate: message.created_at,
            unread: 0, // You'd need to implement read/unread tracking
            item: message.items?.title || 'Unknown Item',
            verified: otherUser?.is_verified || false,
            otherUserId: otherUser?.id,
            itemId: message.item_id
          };
        }
        return acc;
      }, {})
    ) : [];

  // Apply search filter
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Resolve current conversation by ID (works with filtering)
  const currentConversation = selectedConversationId 
    ? conversations.find((c: any) => c.id === selectedConversationId)
    : undefined;
  
  const { data: messagesData } = useConversationMessages(
    currentConversation?.id || '',
    profile?.id || ''
  );
  
  const messages = messagesData?.data?.map((msg: any) => ({
    id: msg.id,
    sender: msg.sender_id === profile?.id ? 'You' : `${msg.sender?.first_name} ${msg.sender?.last_name}`.trim(),
    message: msg.message,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOwn: msg.sender_id === profile?.id
  })) || [];

  // Mark messages as read when a conversation is viewed
  useEffect(() => {
    const convoId = currentConversation?.id;
    if (!convoId || !profile) return;

    // When messages are loaded or conversation changes, set last-read timestamp
    const LAST_READ_KEY = 'quick-swapp-last-read';
    try {
      const raw = localStorage.getItem(LAST_READ_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[convoId] = new Date().toISOString();
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(map));
      // Notify navigation to recalc unread count
      window.dispatchEvent(new Event('last-read-updated'));
    } catch (e) {
      // ignore storage errors in demo
    }
  }, [currentConversation?.id, messagesData?.data?.length, profile?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || !profile) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversation_id: currentConversation.id,
        sender_id: profile.id,
        receiver_id: currentConversation.otherUserId,
        item_id: currentConversation.itemId,
        message: newMessage.trim()
      });
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Auto-select first conversation when data loads and none selected
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  if (conversationsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading conversations...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

          {filteredConversations.length === 0 && !conversationsLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground">
                  Start buying or selling items to begin messaging with other students.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
              {/* Conversations List */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Conversations ({filteredConversations.length})</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search conversations..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50 ${
                            selectedConversationId === conversation.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedConversationId(conversation.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <img
                                src={conversation.avatar}
                                alt={conversation.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                }}
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
                {currentConversation ? (
                  <Card className="h-full flex flex-col">
                    {/* Chat Header */}
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={currentConversation.avatar}
                              alt={currentConversation.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
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
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((message) => (
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
                          ))
                        )}
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
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        >
                          {sendMessageMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        🔒 All messages are encrypted and secure
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose a conversation from the left to start messaging.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
