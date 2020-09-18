const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  name: String,
  tags: [String],
  date: { type: Date, default: Date.now },
});

const Course = mongoose.model('course', courseSchema);

async function retrieveCourses1() {
  return await Course.find({ isPublised: true, tags: 'backend' })
    .sort('name')
    .select({ name: true, author: true });
}

async function retrieveCourses2() {
  return await Course.find({
    isPublised: true,
    tags: { $in: ['backend', 'frontend'] },
  })
    // .or([{ tags: 'backend' }, { tags: 'backend' }])
    .sort('-price')
    .select('name author');
}

async function retrieveCourses3() {
  return await Course.find({
    isPublised: true,
  }).or([{ price: { $gte: 15 } }, { title: /.*by*./i }]);
}
