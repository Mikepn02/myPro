function(req, res) {
    let message = '';
    if (req.method === 'POST') {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }
  
      const file = req.files.uploaded_image;
      const img_name = file.name;
  
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        file.mv(`public/images/uploaded_image/${img_name}`, function(err) {
          if (err) {
            return res.status(500).send(err);
          }
  
          const sql = 'INSERT INTO user_table (email, name, password, profile) VALUES (?, ?, ?, ?)';
          const query = db.query(sql, function(err, result) {
            if (err) {
              return res.status(500).send(err);
            }
            res.redirect(`/profile/${result.insertId}`);
          });
        });
      } else {
        message = 'This format is not allowed, please upload a file with .png, .gif, .jpg';
        res.render('index.ejs', { message });
      }
    } else {
      res.render('index');
    }
  };
  