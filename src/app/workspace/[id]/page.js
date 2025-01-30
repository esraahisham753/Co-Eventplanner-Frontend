'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchEvent, deleteEvent } from '@/store/slices/eventSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import { fetchTeams, createTeam, deleteTeam } from '@/store/slices/teamSlice';
import { fetchBudgetItems, createBudgetItem, deleteBudgetItem } from '@/store/slices/budgetItemSlice';
import { fetchMessages, createMessage } from '@/store/slices/messageSlice';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiHome, FiUsers, FiDollarSign, FiMessageSquare, FiShare2, FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiX, FiImage } from 'react-icons/fi';

const WorkspaceEventPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { event } = useSelector((state) => state.events);
  const { tasks } = useSelector((state) => state.tasks);
  const { teams } = useSelector((state) => state.teams);
  const { budgetItems } = useSelector((state) => state.budgetItems);
  const { messages } = useSelector((state) => state.messages);

  const [activeTab, setActiveTab] = useState('home');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [newBudgetItem, setNewBudgetItem] = useState({
    title: '',
    description: '',
    amount: ''
  });
  const [newMessage, setNewMessage] = useState('');
  const [messageImage, setMessageImage] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchEvent(id));
    dispatch(fetchTasks(id));
    dispatch(fetchTeams(id));
    dispatch(fetchBudgetItems(id));
    dispatch(fetchMessages(id));
  }, [dispatch, id, user, router]);

  // Check if the logged-in user is an organizer
  const isOrganizer = teams?.some(team => 
    team.user === user?.id && 
    team.role === 'organizer'
  );

  const handleDeleteEvent = async () => {
    if (!isOrganizer) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteEvent(id));
      router.push('/workspace');
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (!isOrganizer) return;

    if (newTeamMember.trim()) {
      await dispatch(createTeam({ event: id, username: newTeamMember }));
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = async (teamId) => {
    if (!isOrganizer) return;

    if (window.confirm('Are you sure you want to remove this team member?')) {
      await dispatch(deleteTeam(teamId));
    }
  };

  const handleAddBudgetItem = async (e) => {
    e.preventDefault();
    if (!isOrganizer) return;

    if (newBudgetItem.title && newBudgetItem.amount) {
      await dispatch(createBudgetItem({ ...newBudgetItem, event: id }));
      setNewBudgetItem({ title: '', description: '', amount: '' });
    }
  };

  const handleDeleteBudgetItem = async (itemId) => {
    if (!isOrganizer) return;

    if (window.confirm('Are you sure you want to delete this budget item?')) {
      try {
        await dispatch(deleteBudgetItem(itemId)).unwrap();
        // Refresh budget items after deletion
        dispatch(fetchBudgetItems(id));
      } catch (err) {
        console.error('Failed to delete budget item:', err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() || messageImage) {
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('event', id);
      formData.append('sender', user.id);
      if (messageImage) {
        formData.append('image', messageImage);
      }
      await dispatch(createMessage(formData));
      setNewMessage('');
      setMessageImage(null);
    }
  };

  const tabs = [
    { id: 'home', icon: FiHome, label: 'Home' },
    { id: 'team', icon: FiUsers, label: 'Team' },
    { id: 'budget', icon: FiDollarSign, label: 'Budget' },
    { id: 'messages', icon: FiMessageSquare, label: 'Messages' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-20 bg-white shadow-lg flex flex-col items-center py-6 space-y-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="sr-only">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50 p-6">
            {/* Content based on active tab */}
            {activeTab === 'home' && (
              <HomeRegion 
                event={event}
                tasks={tasks}
                isOrganizer={isOrganizer}
                onDelete={handleDeleteEvent}
              />
            )}
            
            {activeTab === 'team' && (
              <TeamRegion 
                teams={teams}
                isOrganizer={isOrganizer}
                newTeamMember={newTeamMember}
                setNewTeamMember={setNewTeamMember}
                onAddMember={handleAddTeamMember}
                onRemoveMember={handleRemoveTeamMember}
                onBack={() => setActiveTab('home')}
                user={user}
              />
            )}
            
            {activeTab === 'budget' && (
              <BudgetRegion 
                budgetItems={budgetItems}
                isOrganizer={isOrganizer}
                newBudgetItem={newBudgetItem}
                setNewBudgetItem={setNewBudgetItem}
                onAddItem={handleAddBudgetItem}
                onDeleteItem={handleDeleteBudgetItem}
                onBack={() => setActiveTab('home')}
              />
            )}
            
            {activeTab === 'messages' && (
              <MessagesRegion 
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                messageImage={messageImage}
                setMessageImage={setMessageImage}
                onSendMessage={handleSendMessage}
                onBack={() => setActiveTab('home')}
                currentUser={user}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const HomeRegion = ({ event, tasks, isOrganizer, onDelete }) => {
  const router = useRouter();

  const taskStatusIcons = {
    not_started: '🔴',
    in_progress: '🟡',
    completed: '🟢'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{event?.title}</h1>
        {isOrganizer && (
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <FiShare2 className="w-5 h-5 mr-2" />
              Share
            </button>
            <Link 
              href={`/workspace/${event?.id}/edit`}
              className="btn-secondary"
            >
              <FiEdit className="w-5 h-5 mr-2" />
              Edit
            </Link>
            <button 
              onClick={onDelete}
              className="btn-secondary text-red-600 border-red-600 hover:bg-red-50"
            >
              <FiTrash2 className="w-5 h-5 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks yet</p>
          ) : (
            tasks?.map((task) => (
              <Link 
                key={task.id}
                href={`/workspace/${event?.id}/tasks/${task.id}`}
                className="block group"
              >
                <div className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                  <span className="mr-3 text-xl" role="img" aria-label={task.status}>
                    {taskStatusIcons[task.status]}
                  </span>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Assigned to: {task.username}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-gray-100 text-gray-800">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Add Task Button */}
        {isOrganizer && (
          <div className="mt-6 pt-6 border-t text-center">
            <Link 
              href={`/workspace/${event?.id}/tasks/create`}
              className="btn-primary inline-flex items-center"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Create New Task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const TeamRegion = ({ teams, isOrganizer, newTeamMember, setNewTeamMember, onAddMember, onRemoveMember, onBack, user }) => {
  const acceptedTeams = teams?.filter(team => team.invitation_status) || [];
  const pendingTeams = teams?.filter(team => !team.invitation_status) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Team</h2>
      </div>

      {/* Add Team Member Form - only show for organizers */}
      {isOrganizer && (
        <form onSubmit={onAddMember} className="flex gap-4 mb-8">
          <input
            type="text"
            value={newTeamMember}
            onChange={(e) => setNewTeamMember(e.target.value)}
            placeholder="Enter username"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
          >
            Add Member
          </button>
        </form>
      )}

      {/* Accepted Team Members */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                {team.image ? (
                  <Image
                    src={team.image}
                    alt={team.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {team.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{team.username}</p>
                  <p className="text-sm text-gray-500 capitalize">{team.role}</p>
                </div>
              </div>
              {isOrganizer && team.user !== user?.id && (
                <button
                  onClick={() => onRemoveMember(team.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations - only show for organizers */}
      {isOrganizer && pendingTeams.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTeams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-50 rounded-lg shadow-sm p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {team.image ? (
                    <Image
                      src={team.image}
                      alt={team.username}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                      {team.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-700">{team.username}</p>
                    <p className="text-sm text-gray-500">
                      <span className="capitalize">{team.role}</span>
                      <span className="text-amber-600 ml-2">(Pending)</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveMember(team.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BudgetRegion = ({ budgetItems, isOrganizer, newBudgetItem, setNewBudgetItem, onAddItem, onDeleteItem, onBack }) => {
  // Calculate total amount
  const totalAmount = budgetItems?.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Budget</h2>
        <div className="w-8" /> {/* Spacer for alignment */}
      </div>

      {/* Total Amount Card */}
      <div className="bg-primary/5 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
            <p className="text-2xl font-bold text-primary mt-1">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FiDollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Budget Items List */}
      <div className="space-y-4">
        {budgetItems?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-primary">${parseFloat(item.amount).toFixed(2)}</span>
                {isOrganizer && (
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Budget Item Form */}
      {isOrganizer && (
        <form onSubmit={onAddItem} className="mt-6 pt-6 border-t">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newBudgetItem.title}
                onChange={(e) => setNewBudgetItem(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={newBudgetItem.description}
                onChange={(e) => setNewBudgetItem(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newBudgetItem.amount}
                onChange={(e) => setNewBudgetItem(prev => ({
                  ...prev,
                  amount: e.target.value
                }))}
                className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-2 text-sm"
              >
                Add Item
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const MessagesRegion = ({ messages, newMessage, setNewMessage, messageImage, setMessageImage, onSendMessage, currentUser }) => {
  const fileInputRef = React.useRef();
  const messagesEndRef = React.useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessageImage(file);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages List */}
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        {messages?.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === currentUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.sender === currentUser?.id ? 'bg-primary text-white' : 'bg-white'} rounded-lg shadow-sm p-4`}>
              <div className="flex items-center space-x-2 mb-2">
                {message.sender_image ? (
                  <Image
                    src={message.sender_image}
                    alt={message.sender_username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    {message.sender_username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{message.sender_username}</span>
                <span className="text-xs opacity-75">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="break-words">{message.content}</p>
              {message.image && (
                <div className="mt-2">
                  <Image
                    src={message.image}
                    alt="Message attachment"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>

      {/* Message Input */}
      <form onSubmit={onSendMessage} className="p-4 bg-white border-t">
        <div className="flex items-end space-x-4">
          <div className="flex-grow">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="2"
            />
            {messageImage && (
              <div className="mt-2 relative inline-block">
                <Image
                  src={URL.createObjectURL(messageImage)}
                  alt="Upload preview"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setMessageImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-primary"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <FiImage className="w-6 h-6" />
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceEventPage;