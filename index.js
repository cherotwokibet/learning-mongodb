const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises',{useNewUrlParser:true})
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...',err));

const courseSchema = new mongoose.Schema({
    name:String,
    author:String,
    tags:[String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

mongoose.model('Course',courseSchema);

const Course = mongoose.model('Course', courseSchema);


async function getCourses(){
    return await Course
    .find({ isPublished:true, tags:{ $in: ['frontend','backend']}})
    .or([
        { price:{$gte:15}},
        { name: /.*by.*/i}
    ])
    .sort('-price')
    .select('name author price');
    //.count();//returns the number of documents that match criteria
}

async function run(){
    const courses = await getCourses();
    console.log(courses);
}

run();

async function updateCourse(id){
    const course = await Course.findById(id);
    if (!course) return;

    course.isPublished = true;
    course.author = 'Another Author';

    const result = await course.save();
    console.log(result);

}

//updateCourse('// Object_id//');

