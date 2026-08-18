import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const searchTopics = async () => {
  const response = await api.get('/topics');
  return response.data.data;
};
export const getTopicDetails = async (topicName) => {
  const response = await api.get(`/topics/${encodeURIComponent(topicName)}`);
  return response.data.data;
};
export const getLearningPath = async (goalTopic) => {
  const userId = localStorage.getItem('techpath_userId');
  const response = await api.get(`/learning-path/${encodeURIComponent(goalTopic)}`, { params: { userId } });
  return response.data.data;
};

export const markTopicProgress = async (topicName) => {
  const userId = localStorage.getItem('techpath_userId');
  if (!userId) return null;
  const response = await api.post(`/topics/progress`, { userId, topicName });
  return response.data.data;
};
export const getTopicCourses = async (topicName) => {
  const response = await api.get(`/topics/${encodeURIComponent(topicName)}/courses`);
  return response.data.data;
};

export default api;
