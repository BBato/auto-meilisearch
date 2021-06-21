const mongoose = require('mongoose');

const CompanySchema =
	mongoose.Schema('Company') ||
	new mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
				unique: false,
				trim: true,
				minlength: 1
			},

			website: {
				type: String,
				required: true,
				unique: false,
				trim: true,
				minlength: 1
			},

			tagline: {
				type: String,
				required: true,
				unique: false,
				trim: true,
				minlength: 1,
				maxLength: 80
			},

			jobs: {
				type: Array
			},

			yearFounded: Number,
			logoURL: String,
			linkedinURL: String,
			docsURL: String,
			twitterURL: String,
			twitterFollowers: Number,
			githubURL: String,
			alexaUSRank: Number,
			alexaGlobalRank: Number,
			noEmployees: Number,
			raised: Number,
			tech: Array,
			clearbitComplete: Boolean
		},
		{
			timestamps: true
		}
	);

// export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
