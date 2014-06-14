// The Song model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var songSchema = new Schema({
  _id: Schema.ObjectId,
  name: String,
  artist: String,
  genre: String,
  url: String,
  points: { type: Number, default: 0 },
  date_added: { type: Date, default: Date.now },
});

songSchema.statics.findAll = function(cb) {
  this.find().sort({date_added:-1}).exec(cb);
}

songSchema.statics.insert = function(data, cb) {
  var new_song_data = {
    _id: mongoose.Types.ObjectId(),
    name: data.name,
    artist: data.artist,
    genre: data.genre,
    url: data.url
  };
  
  var new_song = new Song(new_song_data);
  new_song.save(cb);
};

songSchema.statics.delete = function(_id, cb) {
  this.remove({_id:_id}).exec(cb);
};

songSchema.statics.update = function(_id, name, artist, genre, url, cb) {
  this.find({_id: _id}, function(err, results) {
    if (err) {
      if (cb) { 
        cb(err); 
      }
    } else if (results.length < 1) {
      if (cb) {
        cd("Update error: No song with id:" + _id)
      }
    } else {
      results[0].name = name;
      results[0].artist = artist;
      results[0].save(cb);
    }
  });
};

// songSchema.statics.findByGenreAfterNum = function(genre, num, cb) {
//   console.log('filtering by ' + genre)
//   this.find({genre: new RegExp(genre, 'i')})
//       .sort({'date_added':  -1})
//       .where('genre').equals(genre)
//       .where('points').lt(10)
//       .where('date_added').gt(Date.now() - 7*24*60*60*1000)
//       .skip(num)
//       .limit(20)
//       .exec(cb);
// }

// songSchema.statics.findAllAfterNum = function(num, cb) {
//   this.find().sort({'date_added':-1})
//       .where('points').lt(10)
//       //.where('date_added').gt(Date.now() - 7*24*60*60*1000)
//       .skip(num)
//       .limit(20)
//       .exec(cb);
// }

// songSchema.statics.addListen = function(_id) {
//   this.find({_id:_id}, function(err, results) {

//     if (err) {
//       console.log('couldnt add point')
//     } else {
//       results[0].points = results[0].points + 1;
//       results[0].save(function(err) {
//         if (err) console.log("couldn't save");
//         else console.log('added like');
//       });
//     }
//   });
// }

// songSchema.statics.insertOrUpdate = function(name, artist, genre, url) {
//   this.find({name:name, artist:artist}, function(err, results) {

// 	if (err) {
//       console.log('error in db call')
//     } else {
//       if (results.length > 0) { // update
//         results[0].points = results[0].points + 2;
//         results[0].save(function(err) {
//           if (err) console.log("couldn't save");
//           else console.log('saved');
//         });
//       } else { // insert
// 		    var new_song_data = {
//           _id: mongoose.Types.ObjectId(),
// 		  	  name: name,
// 		  	  artist: artist,
// 		  	  genre: genre,
// 		      url: url,
//           points: 0,
//           date_added: Date.now()
// 	      };
// 		  var new_song = new Song(new_song_data);
//           new_song.save(function(err) {
//           if (err) console.log(err);
//         });
//       }
//     }
//   });
// }

var Song = module.exports = mongoose.model('Song', songSchema);
