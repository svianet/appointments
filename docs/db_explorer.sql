select * from aep_users;
select * from aep_contacts;
select * from aep_appointments;
select * from aep_events;
select * from aep_policies;

select distinct eventstatus from aep_events;

select aep_contacts.contact_id, aep_contacts.name
, aep_appointments.*
from aep_appointments 
join aep_contacts on aep_contacts.contact_id = aep_appointments.contact_id
join aep_events on aep_events.event_id = aep_appointments.event_id
where eventstatus = 'Planned'
and aep_events.user_id = '501'
order by appointment_time;

-- total by status
select count(aep_appointments.id) total_appointments
	, eventstatus
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
group by eventstatus;

-- total by agent
select count(aep_appointments.id) total_appointments
	, eventstatus, aep_users.user_id, aep_users.name
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
join aep_users on aep_users.user_id = aep_events.user_id
group by eventstatus, aep_users.user_id, aep_users.name
order by aep_users.user_id;

-- distribution by agent (identify overload)

-- agents available x appointments daily

-- policy completed x planned

-- percentage without attempt to contact