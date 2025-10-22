const Joi = require('joi');

// Schéma de validation pour un patient
const patientSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Le prénom est obligatoire',
            'string.min': 'Le prénom doit contenir au moins 2 caractères',
            'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
            'any.required': 'Le prénom est obligatoire'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Le nom de famille est obligatoire',
            'string.min': 'Le nom de famille doit contenir au moins 2 caractères',
            'string.max': 'Le nom de famille ne peut pas dépasser 50 caractères',
            'any.required': 'Le nom de famille est obligatoire'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'L\'email est obligatoire',
            'string.email': 'L\'email doit être une adresse email valide',
            'any.required': 'L\'email est obligatoire'
        }),

    phone: Joi.string()
    .pattern(/^(\+33[\s.]?|0)[1-9]([\s.]?\d{2}){4}$/)
    .required()
    .messages({
        'string.pattern.base': 'Le numéro de téléphone doit être au format français (ex: 01.23.45.67.89 ou 01 23 45 67 89)',
        'any.required': 'Le numéro de téléphone est obligatoire'
    }),

    dateOfBirth: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'La date de naissance ne peut pas être dans le futur',
            'any.required': 'La date de naissance est obligatoire'
        }),

    address: Joi.string()
        .min(5)
        .max(255)
        .required()
        .messages({
            'string.min': 'L\'adresse doit contenir au moins 5 caractères',
            'string.max': 'L\'adresse ne peut pas dépasser 255 caractères',
            'any.required': 'L\'adresse est obligatoire'
        }),

    medicalHistory: Joi.string()
        .max(1000)
        .allow('', null)
        .messages({
            'string.max': 'L\'historique médical ne peut pas dépasser 1000 caractères'
        })
});

// Schéma de validation pour le praticien
const practitionerSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Le prénom est obligatoire',
            'string.min': 'Le prénom doit contenir au moins 2 caractères',
            'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
            'any.required': 'Le prénom est obligatoire'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Le nom de famille est obligatoire',
            'string.min': 'Le nom de famille doit contenir au moins 2 caractères',
            'string.max': 'Le nom de famille ne peut pas dépasser 50 caractères',
            'any.required': 'Le nom de famille est obligatoire'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'L\'email est obligatoire',
            'string.email': 'L\'email doit être une adresse email valide',
            'any.required': 'L\'email est obligatoire'
        }),

    phone: Joi.string()
        .pattern(/^(\+33[\s.]?|0)[1-9]([\s.]?\d{2}){4}$/)
        .required()
        .messages({
            'string.pattern.base': 'Le numéro de téléphone doit être au format français (ex: 01.23.45.67.89 ou 01 23 45 67 89)',
            'any.required': 'Le numéro de téléphone est obligatoire'
        }),

    specialty: Joi.string()
        .valid('cardiologue', 'dermatologue', 'generaliste', 'pediatre', 'psychiatre', 'ophtalmologue')
        .required()
        .messages({
            'any.only': 'La spécialité doit être l\'une des suivantes : cardiologue, dermatologue, generaliste, pediatre, psychiatre, ophtalmologue',
            'any.required': 'La spécialité est obligatoire'
        }),

    licenseNumber: Joi.string()
        .pattern(/^[A-Za-z0-9]{8,20}$/)
        .required()
        .messages({
            'string.pattern.base': 'Le numéro de licence doit contenir entre 8 et 20 caractères alphanumériques',
            'any.required': 'Le numéro de licence est obligatoire'
        }),

    experience: Joi.number()
        .integer()
        .min(0)
        .max(50)
        .required()
        .messages({
            'number.min': 'L\'expérience doit être au moins de 0 années',
            'number.max': 'L\'expérience ne peut pas dépasser 50 années',
            'any.required': 'L\'expérience est obligatoire'
        })
});

// Schéma de validation pour le rendez-vous
const appointmentSchema = Joi.object({
    patientId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'ID du patient doit être un nombre entier positif',
            'number.positive': 'L\'ID du patient doit être un nombre entier positif',
            'any.required': 'L\'ID du patient est obligatoire'
        }),

    practitionerId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'ID du praticien doit être un nombre entier positif',
            'number.positive': 'L\'ID du praticien doit être un nombre entier positif',
            'any.required': 'L\'ID du praticien est obligatoire'
        }),

    date: Joi.date()
        .min('now')
        .required()
        .messages({
            'date.min': 'La date du rendez-vous doit être dans le futur',
            'any.required': 'La date du rendez-vous est obligatoire'
        }),

    motif: Joi.string()
        .min(5)
        .max(255)
        .required()
        .messages({
            'string.min': 'Le motif doit contenir au moins 5 caractères',
            'string.max': 'Le motif ne peut pas dépasser 255 caractères',
            'any.required': 'Le motif est obligatoire'
        }),

    status: Joi.string()
        .valid('scheduled', 'completed', 'cancelled')
        .default('scheduled')    
        .messages({
            'any.only': 'Le statut doit être l\'un des suivants : scheduled, completed, cancelled'
        }),

    notes: Joi.string()
        .max(500)
        .allow('', null)
        .optional()
        .messages({
            'string.max': 'Les notes ne peuvent pas dépasser 500 caractères'
        })
});

// Schéma de validation pour la facture
const billSchema = Joi.object({
    patientId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'ID du patient doit être un nombre entier positif',
            'number.positive': 'L\'ID du patient doit être un nombre entier positif',
            'any.required': 'L\'ID du patient est obligatoire'
        }),
     
    appointmentId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'ID du rendez-vous doit être un nombre entier positif',
            'number.positive': 'L\'ID du rendez-vous doit être un nombre entier positif',
            'any.required': 'L\'ID du rendez-vous est obligatoire'
        }),
        
    amount: Joi.number()
        .positive()
        .precision(2)
        .max(9999.99)
        .required()
        .messages({
            'number.positive': 'Le montant doit être un nombre positif',
            'number.max': 'Le montant ne peut pas dépasser 9999.99',
            'any.required': 'Le montant est obligatoire'
        }),

    currency: Joi.string()
        .valid('EUR', 'USD', 'GBP')
        .default('EUR')
        .messages({
            'any.only': 'La devise doit être l\'une des suivantes : EUR, USD, GBP'
        }),

    date: Joi.date()
        .max('now')
        .default(Date.now)
        .messages({
            'date.max': 'La date de la facture ne peut pas être dans le futur'
        }),

    status: Joi.string()
        .valid('pending', 'paid', 'cancelled')
        .default('pending')
        .messages({
            'any.only': 'Le statut doit être l\'un des suivants : pending, paid, cancelled'
        }),

    description: Joi.string()
        .min(5)
        .max(1000)
        .required()
        .messages({
            'string.min': 'La description doit contenir au moins 5 caractères',
            'string.max': 'La description ne peut pas dépasser 1000 caractères',
            'any.required': 'La description est obligatoire'
        })
});


// Middleware de validation
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            //Formatter les erreurs pour un meilleur affichage 
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(422).json({
                error: 'Validation failed',
                details: errors
            });
        }

        next();
    };
};

module.exports = {
    patientSchema,
    practitionerSchema,
    appointmentSchema,
    billSchema,
    validate
};