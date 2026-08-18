import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getTopics = () => api.get('/topics').then(res => res.data);
export const getTopicByName = (name) => api.get(`/topics/${name}`).then(res => res.data);
export const getLearningPath = (topic) => api.get(`/learning-path/${topic}`).then(res => res.data);
export const getTopicCourses = (name) => api.get(`/topics/${name}/courses`).then(res => res.data);

export default api;
