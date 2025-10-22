'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Méthodes d'assistance définies par l'utilisateur.
     */
    static associate(models) {
      // Définir les associations avec d'autres modèles
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });
      Appointment.belongsTo(models.Practitioner, {
        foreignKey: 'practitionerId',
        as: 'practitioner'
      });
      Appointment.hasOne(models.Bill, {
        foreignKey: 'appointmentId',
        as: 'bill'
      });
    }
  }
  Appointment.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id'
      }
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Practitioners',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString(), // Rendez-vous dans le futur uniquement
        isBusinessHours(value) { // Validation des heures d'ouverture (8h-18h)
          const hour = new Date(value).getHours();
          if (hour < 8 || hour >= 18) {
            throw new Error('Appointments can only be scheduled between 8 AM and 6 PM');
          }
        }
      }
    },
    motif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255] // Motif entre 5 et 255 caractères
      }
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled' // Statut par défaut : programmé
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500] // Notes optionnelles, max 500 caractères
      }
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    // Validation personnalisée pour éviter les conflits horaires
    validate: {
      noTimeConflict() {
        // Cette validation est gérée dans les routes pour plus de flexibilité
        return true;
      }
    }
  });
  return Appointment;
};