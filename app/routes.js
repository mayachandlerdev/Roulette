module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('profile.ejs'); //gonna be the game
        //when I render my pg at first, bring me to profile pg
    });

    // PROFILE SECTION =========================
    app.get('/casinoinfo', isLoggedIn, function(req, res) {
        db.collection('casinolife').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('casinoinfo.ejs', {
            user: req.body.user,
            messages: result
            //give me results for this from main.js
          })
        })
    });
    //get casino info pg and go into casino collection and find all the documents

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //when I logout, direct me back to home pg
// message board routes ===============================================================

    app.post('/casinoinfo', (req, res) => {
      console.log(req.body)
      db.collection('casinolife').save({mMade: req.body.mMade, mLost: req.body.mLost, tWins: req.body.tWins, tLost:req.body.tLost}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/casinoinfo')
      })
    })
//when I create casino info, go into my collection and save all my documents
    app.put('/casinolife', (req, res) => {
      db.collection('casinolife')
      .findOneAndUpdate({mMade: req.body.mMade, mLost: req.body.mLost, tWins: req.body.tWins, tLost:req.body.tLost}, {
        $set: {
          user: req.user,
          mMade: req.body.mMade,
          mLost: req.body.mLost,
          tWins: req.body.tWins,
          tLost: req.body.tLost
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
//update casino info collections
    // app.delete('/messages', (req, res) => {
    //   db.collection('casinolife').findOneAndDelete({mMade: req.body.mMade, mLost: req.body.mLost, tWins: req.body.tWins, tLost:req.body.tLost}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/casinoinfo', // redirect to the secure profile section
            failureRedirect : '/profile', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/casinoinfo', // redirect to the secure profile section
            failureRedirect : '/profile', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/casinoinfo');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
